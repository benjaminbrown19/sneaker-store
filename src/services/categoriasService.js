import { categoriasSeed } from '../data/categorias.seed'
import { crearRepositorio } from './repositorio'

export const CLAVE_CATEGORIAS = 'grip_categorias'

export const categoriasService = crearRepositorio({
  clave: CLAVE_CATEGORIAS,
  semilla: categoriasSeed,
  campoId: 'id',
})

export function generarIdCategoria(nombre) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
