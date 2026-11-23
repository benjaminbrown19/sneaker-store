import { api } from './api'

const ruta = '/ordenes'

function numero(valor) {
  const resultado = Number(valor)
  return Number.isFinite(resultado) ? resultado : 0
}

function normalizarOrden(datos) {
  const cliente = datos.cliente || {}
  const entrega = datos.entrega || {}
  const pago = datos.pago || {}

  return {
    id: datos.id,
    fecha: datos.fecha,
    cliente: {
      nombre: cliente.nombre || '',
      apellidos: cliente.apellidos || '',
      correo: cliente.correo || null,
    },
    items: Array.isArray(datos.items)
      ? datos.items.map((item) => ({
          codigo: item.codigo,
          nombre: item.nombre,
          cantidad: numero(item.cantidad),
          precioUnitario: numero(item.precioUnitario),
          subtotal: numero(item.subtotal),
        }))
      : [],
    subtotal: numero(datos.subtotal ?? datos.total),
    descuento: numero(datos.descuento),
    envio: numero(datos.envio),
    total: numero(datos.total),
    estado: datos.estado || 'registrada',
    canal: datos.canal || 'online',
    vendedor: datos.vendedor || null,
    entrega: {
      tipo: entrega.tipo || 'retiro',
      region: entrega.region || '',
      comuna: entrega.comuna || '',
      direccion: entrega.direccion || '',
    },
    pago: {
      metodo: pago.metodo || 'no_informado',
      ultimos4: pago.ultimos4 || '',
      codigoAutorizacion: pago.codigoAutorizacion || '',
      cuotas: pago.cuotas ?? null,
    },
    cupon: datos.cupon || null,
  }
}

function construirEntrada(datos) {
  return {
    cliente: {
      nombre: datos.cliente.nombre,
      apellidos: datos.cliente.apellidos || '',
      correo: datos.cliente.correo || null,
    },
    items: (datos.items || []).map((item) => ({
      codigo: item.codigo,
      cantidad: Number(item.cantidad),
    })),
    canal: datos.canal || 'online',
    entrega: datos.entrega || { tipo: 'retiro' },
    pago: datos.pago || { metodo: 'no_informado' },
    vendedor: datos.vendedor || null,
    cupon: datos.cupon || null,
  }
}

export const ordenesApi = {
  async listar() {
    const datos = await api(ruta)
    return (Array.isArray(datos) ? datos : []).map(normalizarOrden)
  },

  async obtener(id) {
    const datos = await api(`${ruta}/${encodeURIComponent(id)}`)
    return normalizarOrden(datos)
  },

  async crear(datos) {
    const entrada = construirEntrada(datos)
    // El checkout público no permite crear ventas atribuidas a un vendedor.
    const endpoint = entrada.canal === 'vendedor' ? ruta : `${ruta}/checkout`
    const creada = await api(endpoint, {
      method: 'POST',
      body: JSON.stringify(entrada),
    })
    return normalizarOrden(creada)
  },

  async listarPorCorreo(correo) {
    const buscado = (correo || '').trim().toLowerCase()
    const ordenes = await this.listar()
    return ordenes.filter((orden) => (orden.cliente.correo || '').toLowerCase() === buscado)
  },

  async listarRecientes() {
    const ordenes = await this.listar()
    return [...ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  },
}
