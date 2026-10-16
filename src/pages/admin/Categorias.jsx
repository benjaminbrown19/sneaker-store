import { useState } from 'react'
import { Link } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaCategorias from '../../components/organisms/TablaCategorias'
import { categoriasService } from '../../services/categoriasService'
import { productosService } from '../../services/productosService'

function contarProductos() {
  return productosService.listar().reduce((conteos, producto) => {
    conteos[producto.categoria] = (conteos[producto.categoria] ?? 0) + 1
    return conteos
  }, {})
}

export default function Categorias() {
  const [categorias, setCategorias] = useState(() => categoriasService.listar())
  const [conteos, setConteos] = useState(() => contarProductos())

  function eliminar(id) {
    if ((conteos[id] ?? 0) > 0) {
      window.alert('No puedes eliminar una categoría que tiene productos asociados.')
      return
    }
    if (!window.confirm('¿Eliminar esta categoría?')) return
    categoriasService.eliminar(id)
    setCategorias(categoriasService.listar())
    setConteos(contarProductos())
  }

  return (
    <>
      <TituloSeccion titulo="Categorías" subtitulo="Agrupaciones del catálogo." />
      <p>
        <Link to="/admin/categorias/nueva" className="btn btn-warning boton-grip">Nueva categoría</Link>
      </p>
      <TablaCategorias categorias={categorias} conteos={conteos} onEliminar={eliminar} />
    </>
  )
}
