import { usuariosSeed } from '../data/usuarios.seed'
import { crearRepositorio } from './repositorio'

export const CLAVE_USUARIOS = 'grip_usuarios'

const repositorio = crearRepositorio({
  clave: CLAVE_USUARIOS,
  semilla: usuariosSeed,
  campoId: 'id',
})

function siguienteId() {
  const numeros = repositorio
    .listar()
    .map((usuario) => parseInt(String(usuario.id).replace('USR-', ''), 10))
    .filter((numero) => !Number.isNaN(numero))
  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1
  return `USR-${String(siguiente).padStart(3, '0')}`
}

function buscarPorCorreo(correo) {
  const buscado = (correo || '').trim().toLowerCase()
  return repositorio.listar().find((usuario) => usuario.correo.toLowerCase() === buscado) ?? null
}

function buscarPorRun(run) {
  const buscado = (run || '').trim().toUpperCase()
  return repositorio.listar().find((usuario) => usuario.run.toUpperCase() === buscado) ?? null
}

function registrar(datos) {
  if (buscarPorCorreo(datos.correo)) {
    return { ok: false, error: 'Ya existe un usuario con ese correo.' }
  }
  if (buscarPorRun(datos.run)) {
    return { ok: false, error: 'Ya existe un usuario con ese RUN.' }
  }
  const usuario = {
    ...datos,
    id: siguienteId(),
    run: datos.run.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim(),
    direccion: datos.direccion.trim(),
    tipoUsuario: datos.tipoUsuario || 'cliente',
  }
  return repositorio.crear(usuario)
}

export const usuariosService = {
  ...repositorio,
  buscarPorCorreo,
  buscarPorRun,
  registrar,
}
