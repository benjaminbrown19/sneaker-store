import jasmineDom from '@testing-library/jasmine-dom'
import { productosSeed } from '../data/productos.seed'

const matchers = jasmineDom.default ?? jasmineDom
let productosEnServidor = []
let ordenesEnServidor = []
let secuenciaOrden = 0

function respuestaJson(datos, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => datos,
  }
}

function clonar(datos) {
  return JSON.parse(JSON.stringify(datos))
}

function crearOrdenPrueba(entrada, esCheckoutPublico = false) {
  const lineas = []
  let subtotal = 0

  for (const linea of entrada.items || []) {
    const producto = productosEnServidor.find((item) => item.codigo === linea.codigo)
    if (!producto) return { error: 'Producto inexistente.', status: 400 }
    if (!Number.isInteger(Number(linea.cantidad)) || Number(linea.cantidad) < 1) {
      return { error: 'Cantidad inválida.', status: 400 }
    }
    if (producto.stock < Number(linea.cantidad)) {
      return { error: 'Stock insuficiente.', status: 409 }
    }

    const precio = Math.round(Number(producto.precio) * (1 - Number(producto.descuento || 0) / 100))
    const cantidad = Number(linea.cantidad)
    const parcial = precio * cantidad
    subtotal += parcial
    lineas.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: precio,
      subtotal: parcial,
    })
  }

  const cupon = entrada.cupon || null
  const porcentaje = cupon === 'GRIP10' ? 0.1 : cupon === 'GRIP20' ? 0.2 : 0
  const descuento = Math.round(subtotal * porcentaje)
  const entrega = entrada.entrega || { tipo: 'retiro' }
  const envio = entrega.tipo === 'domicilio' && subtotal < 50000 ? 3990 : 0
  const total = subtotal - descuento + envio

  lineas.forEach((linea) => {
    const producto = productosEnServidor.find((item) => item.codigo === linea.codigo)
    producto.stock -= linea.cantidad
  })

  secuenciaOrden += 1
  const orden = {
    id: `ORD-TEST-${secuenciaOrden}`,
    fecha: new Date().toISOString(),
    cliente: entrada.cliente,
    items: lineas,
    subtotal,
    descuento,
    envio,
    total,
    estado: 'pagada',
    canal: esCheckoutPublico ? 'online' : (entrada.canal || 'online'),
    vendedor: esCheckoutPublico ? null : (entrada.vendedor || null),
    entrega,
    pago: entrada.pago || { metodo: 'no_informado' },
    cupon,
  }

  ordenesEnServidor.unshift(orden)
  return { orden }
}

beforeAll(() => {
  jasmine.addMatchers(matchers)
})

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  productosEnServidor = clonar(productosSeed)
  ordenesEnServidor = []
  secuenciaOrden = 0

  // Las pruebas no dependen de que Spring Boot/MySQL estén encendidos.
  // Se simulan los endpoints REST de productos y órdenes.
  spyOn(window, 'fetch').and.callFake(async (entrada, opciones = {}) => {
    const direccion = typeof entrada === 'string' ? entrada : entrada.url
    const url = new URL(direccion, window.location.origin)
    const ruta = url.pathname.replace(/^\/api\/v1/, '')
    const metodo = (opciones.method || 'GET').toUpperCase()

    if (ruta === '/productos') {
      if (metodo === 'GET') return respuestaJson(clonar(productosEnServidor))

      if (metodo === 'POST') {
        const producto = JSON.parse(opciones.body || '{}')
        if (productosEnServidor.some((p) => p.codigo === producto.codigo)) {
          return respuestaJson({ message: 'Código ya registrado.' }, 409)
        }
        productosEnServidor.push(producto)
        return respuestaJson(clonar(producto), 201)
      }
    }

    const coincidenciaProducto = ruta.match(/^\/productos\/([^/]+)$/)
    if (coincidenciaProducto) {
      const codigo = decodeURIComponent(coincidenciaProducto[1])
      const indice = productosEnServidor.findIndex((p) => p.codigo === codigo)

      if (metodo === 'GET') {
        return indice >= 0
          ? respuestaJson(clonar(productosEnServidor[indice]))
          : respuestaJson({ message: 'Producto no encontrado.' }, 404)
      }

      if (metodo === 'PUT') {
        if (indice < 0) return respuestaJson({ message: 'Producto no encontrado.' }, 404)
        const cambios = JSON.parse(opciones.body || '{}')
        productosEnServidor[indice] = { ...productosEnServidor[indice], ...cambios, codigo }
        return respuestaJson(clonar(productosEnServidor[indice]))
      }

      if (metodo === 'DELETE') {
        if (indice < 0) return respuestaJson({ message: 'Producto no encontrado.' }, 404)
        productosEnServidor.splice(indice, 1)
        return respuestaJson(null, 204)
      }
    }

    if (ruta === '/ordenes/checkout' || ruta === '/ordenes') {
      if (metodo === 'GET') return respuestaJson(clonar(ordenesEnServidor))
      if (metodo === 'POST') {
        const entrada = JSON.parse(opciones.body || '{}')
        const resultado = crearOrdenPrueba(entrada, ruta === '/ordenes/checkout')
        if (resultado.error) return respuestaJson({ message: resultado.error }, resultado.status)
        return respuestaJson(clonar(resultado.orden), 201)
      }
    }

    const coincidenciaOrden = ruta.match(/^\/ordenes\/([^/]+)$/)
    if (coincidenciaOrden && metodo === 'GET') {
      const id = decodeURIComponent(coincidenciaOrden[1])
      const orden = ordenesEnServidor.find((item) => item.id === id)
      return orden
        ? respuestaJson(clonar(orden))
        : respuestaJson({ message: 'Orden no encontrada.' }, 404)
    }

    return respuestaJson({ message: `Endpoint de prueba no simulado: ${metodo} ${ruta}` }, 404)
  })
})

const contexto = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /\.spec\.jsx?$/,
})
contexto.keys().forEach(contexto)
