import { leer, guardar } from './almacen'

export function crearRepositorio({ clave, semilla, campoId }) {
  function listar() {
    const guardados = leer(clave, null)
    if (!Array.isArray(guardados)) {
      guardar(clave, semilla)
      return [...semilla]
    }
    return guardados
  }

  function obtener(id) {
    return listar().find((registro) => registro[campoId] === id) ?? null
  }

  function crear(registro) {
    const todos = listar()
    if (todos.some((existente) => existente[campoId] === registro[campoId])) {
      return { ok: false, error: `Ya existe un registro con el identificador ${registro[campoId]}.` }
    }
    guardar(clave, [...todos, registro])
    return { ok: true, registro }
  }

  function actualizar(id, cambios) {
    const todos = listar()
    const indice = todos.findIndex((registro) => registro[campoId] === id)
    if (indice === -1) return { ok: false, error: 'El registro no existe.' }

    const actualizado = { ...todos[indice], ...cambios, [campoId]: id }
    const copia = [...todos]
    copia[indice] = actualizado
    guardar(clave, copia)
    return { ok: true, registro: actualizado }
  }

  function eliminar(id) {
    const todos = listar()
    const restantes = todos.filter((registro) => registro[campoId] !== id)
    if (restantes.length === todos.length) return { ok: false, error: 'El registro no existe.' }
    guardar(clave, restantes)
    return { ok: true }
  }

  function reemplazarTodo(registros) {
    guardar(clave, registros)
  }

  return { listar, obtener, crear, actualizar, eliminar, reemplazarTodo }
}
