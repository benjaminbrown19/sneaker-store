import { useState } from 'react'
import { Link } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaProductos from '../../components/organisms/TablaProductos'
import { useSesion } from '../../context/SesionContext'
import { productosService } from '../../services/productosService'

export default function Productos() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'administrador'
  const [productos, setProductos] = useState(() => productosService.listar())

  function eliminar(codigo) {
    if (!window.confirm(`¿Eliminar el producto ${codigo}?`)) return
    productosService.eliminar(codigo)
    setProductos(productosService.listar())
  }

  return (
    <>
      <TituloSeccion titulo="Productos" subtitulo="Inventario de la tienda." />
      <div className="d-flex gap-2 flex-wrap mb-3">
        {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-warning boton-grip">Nuevo producto</Link>}
        <Link to="/admin/productos/criticos" className="btn btn-outline-dark boton-grip">Productos críticos</Link>
      </div>
      <TablaProductos productos={productos} puedeEditar={esAdmin} onEliminar={eliminar} />
    </>
  )
}
