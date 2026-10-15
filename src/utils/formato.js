export function formatearPrecio(valor) {
  return Number(valor || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
}

export function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function precioFinal(producto) {
  const descuento = Number(producto.descuento) || 0
  return Math.round(producto.precio * (1 - descuento / 100))
}
