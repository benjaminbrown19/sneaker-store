import { cupones, ENVIO_GRATIS_DESDE, COSTO_ENVIO } from '../data/cupones'
import { precioFinal } from './formato'

export function armarLineas(items, productos) {
  return items
    .map((item) => {
      const producto = productos.find((candidato) => candidato.codigo === item.codigo)
      if (!producto) return null
      const precioUnitario = precioFinal(producto)
      return {
        producto,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal: precioUnitario * item.cantidad,
      }
    })
    .filter(Boolean)
}

export function calcularEnvio(subtotal, tipoEntrega) {
  if (tipoEntrega === 'retiro') return 0
  if (subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE) return 0
  return COSTO_ENVIO
}

export function calcularResumen(lineas, cupon, tipoEntrega = 'domicilio') {
  const subtotal = lineas.reduce((suma, linea) => suma + linea.subtotal, 0)
  const descuento = cupon ? Math.round(subtotal * cupon.porcentaje) : 0
  const envio = calcularEnvio(subtotal, tipoEntrega)
  return {
    subtotal,
    descuento,
    envio,
    total: subtotal - descuento + envio,
  }
}

export function buscarCupon(codigo) {
  const normalizado = (codigo || '').trim().toUpperCase()
  const porcentaje = cupones[normalizado]
  if (porcentaje === undefined) return null
  return { codigo: normalizado, porcentaje }
}
