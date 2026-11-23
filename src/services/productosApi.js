import { api } from './api'
import { productosService } from './productosService'

const ruta = '/productos'

export const productosApi = {
  async listar() {
    const productos = await api(ruta)
    productosService.reemplazarTodo(productos)
    return productos
  },

  obtener(codigo) {
    return api(`${ruta}/${encodeURIComponent(codigo)}`)
  },

  async crear(producto) {
    const creado = await api(ruta, {
      method: 'POST',
      body: JSON.stringify(producto),
    })

    const actuales = productosService.listar()
    productosService.reemplazarTodo([
      ...actuales.filter((item) => item.codigo !== creado.codigo),
      creado,
    ])
    return creado
  },

  async actualizar(codigo, producto) {
    const actualizado = await api(`${ruta}/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    })

    const actuales = productosService.listar().map((item) =>
      item.codigo === codigo ? actualizado : item,
    )
    productosService.reemplazarTodo(actuales)
    return actualizado
  },

  async eliminar(codigo) {
    await api(`${ruta}/${encodeURIComponent(codigo)}`, { method: 'DELETE' })
    productosService.eliminar(codigo)
    return null
  },
}
