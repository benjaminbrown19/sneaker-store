import { productosSeed } from '../data/productos.seed'
import { crearRepositorio } from './repositorio'
import { precioFinal } from '../utils/formato'

export const CLAVE_PRODUCTOS = 'grip_productos'

const repositorio = crearRepositorio({
  clave: CLAVE_PRODUCTOS,
  semilla: productosSeed,
  campoId: 'codigo',
})

export const productosService = {
  ...repositorio,

  listarPorCategoria(categoria) {
    return repositorio.listar().filter((producto) => producto.categoria === categoria)
  },

  listarOfertas() {
    return repositorio.listar().filter((producto) => Number(producto.descuento) > 0)
  },

  listarCriticos() {
    return repositorio.listar().filter((producto) => producto.stock <= producto.stockCritico)
  },

  buscar(texto) {
    const termino = (texto || '').trim().toLowerCase()
    if (!termino) return repositorio.listar()
    return repositorio
      .listar()
      .filter((producto) => `${producto.nombre} ${producto.descripcion}`.toLowerCase().includes(termino))
  },

  descontarStock(items) {
    const productos = repositorio.listar().map((producto) => {
      const linea = items.find((item) => item.codigo === producto.codigo)
      if (!linea) return producto
      return { ...producto, stock: Math.max(0, producto.stock - linea.cantidad) }
    })
    repositorio.reemplazarTodo(productos)
  },

  precioFinal,
}
