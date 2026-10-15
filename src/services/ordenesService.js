import { crearRepositorio } from './repositorio'

export const CLAVE_ORDENES = 'grip_ordenes'

const repositorio = crearRepositorio({
  clave: CLAVE_ORDENES,
  semilla: [],
  campoId: 'id',
})

export const ordenesService = {
  ...repositorio,

  registrar(datos) {
    const orden = {
      ...datos,
      id: `ORD-${Date.now()}`,
      fecha: new Date().toISOString(),
    }
    repositorio.crear(orden)
    return orden
  },

  listarPorCorreo(correo) {
    const buscado = (correo || '').toLowerCase()
    return repositorio.listar().filter((orden) => (orden.cliente?.correo || '').toLowerCase() === buscado)
  },

  listarRecientes() {
    return [...repositorio.listar()].reverse()
  },
}
