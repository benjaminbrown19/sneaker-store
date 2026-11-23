import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { leer, guardar, borrar } from '../services/almacen'
import { productosService } from '../services/productosService'
import { productosApi } from '../services/productosApi'
import { armarLineas, buscarCupon, calcularResumen } from '../utils/carrito'

export const CLAVE_CARRITO = 'grip_carrito'
export const CLAVE_CUPON = 'grip_cupon'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = leer(CLAVE_CARRITO, [])
    return Array.isArray(guardado) ? guardado : []
  })
  const [cupon, setCupon] = useState(() => leer(CLAVE_CUPON, null))
  const [catalogoVersion, setCatalogoVersion] = useState(0)

  const refrescarCatalogo = useCallback(async () => {
    const productos = await productosApi.listar()
    setCatalogoVersion((version) => version + 1)
    return productos
  }, [])

  useEffect(() => {
    let activo = true
    productosApi.listar()
      .then(() => {
        if (activo) setCatalogoVersion((version) => version + 1)
      })
      .catch(() => {
        // Si Spring Boot no está disponible, la tienda conserva el catálogo local de respaldo.
      })
    return () => { activo = false }
  }, [])

  const persistirItems = useCallback((nuevos) => {
    guardar(CLAVE_CARRITO, nuevos)
    setItems(nuevos)
  }, [])

  const agregar = useCallback(
    (codigo, cantidad = 1) => {
      const producto = productosService.obtener(codigo)
      if (!producto) return { ok: false, mensaje: 'Producto no encontrado.' }

      const existente = items.find((item) => item.codigo === codigo)
      const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad

      if (nuevaCantidad > producto.stock) {
        return { ok: false, mensaje: `Solo quedan ${producto.stock} unidades de ${producto.nombre}.` }
      }

      const nuevos = existente
        ? items.map((item) => (item.codigo === codigo ? { ...item, cantidad: nuevaCantidad } : item))
        : [...items, { codigo, cantidad }]
      persistirItems(nuevos)
      return { ok: true }
    },
    [items, persistirItems],
  )

  const quitar = useCallback(
    (codigo) => {
      persistirItems(items.filter((item) => item.codigo !== codigo))
    },
    [items, persistirItems],
  )

  const cambiarCantidad = useCallback(
    (codigo, cantidad) => {
      const producto = productosService.obtener(codigo)
      if (!producto) return
      if (cantidad < 1) {
        persistirItems(items.filter((item) => item.codigo !== codigo))
        return
      }
      const limitada = Math.min(cantidad, producto.stock)
      persistirItems(items.map((item) => (item.codigo === codigo ? { ...item, cantidad: limitada } : item)))
    },
    [items, persistirItems],
  )

  const vaciar = useCallback(() => {
    borrar(CLAVE_CARRITO)
    borrar(CLAVE_CUPON)
    setItems([])
    setCupon(null)
  }, [])

  const aplicarCupon = useCallback((codigo) => {
    if (!(codigo || '').trim()) return { ok: false, mensaje: 'Ingresa un código de cupón.' }
    const encontrado = buscarCupon(codigo)
    if (!encontrado) {
      borrar(CLAVE_CUPON)
      setCupon(null)
      return { ok: false, mensaje: 'Ese cupón no es válido.' }
    }
    guardar(CLAVE_CUPON, encontrado)
    setCupon(encontrado)
    return { ok: true, cupon: encontrado }
  }, [])

  const quitarCupon = useCallback(() => {
    borrar(CLAVE_CUPON)
    setCupon(null)
  }, [])

  const lineas = useMemo(
    () => armarLineas(items, productosService.listar()),
    [items, catalogoVersion],
  )
  const cantidadTotal = useMemo(() => lineas.reduce((suma, linea) => suma + linea.cantidad, 0), [lineas])

  const resumenPara = useCallback((tipoEntrega) => calcularResumen(lineas, cupon, tipoEntrega), [lineas, cupon])
  const resumen = useMemo(() => calcularResumen(lineas, cupon, 'domicilio'), [lineas, cupon])

  const valor = useMemo(
    () => ({
      items,
      lineas,
      cupon,
      cantidadTotal,
      resumen,
      resumenPara,
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
      aplicarCupon,
      quitarCupon,
      refrescarCatalogo,
    }),
    [items, lineas, cupon, cantidadTotal, resumen, resumenPara, agregar, quitar, cambiarCantidad, vaciar, aplicarCupon, quitarCupon, refrescarCatalogo],
  )

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  }
  return contexto
}
