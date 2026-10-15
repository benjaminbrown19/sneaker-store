import { useCallback, useEffect, useState } from 'react'
import { useCarrito } from '../context/CarritoContext'

export function useAvisoCarrito() {
  const { agregar } = useCarrito()
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(null), 2500)
    return () => clearTimeout(temporizador)
  }, [aviso])

  const agregarConAviso = useCallback(
    (codigo, cantidad = 1) => {
      const resultado = agregar(codigo, cantidad)
      setAviso(
        resultado.ok
          ? { variante: 'success', texto: 'Producto añadido al carrito.' }
          : { variante: 'danger', texto: resultado.mensaje },
      )
      return resultado
    },
    [agregar],
  )

  return { aviso, agregarConAviso }
}
