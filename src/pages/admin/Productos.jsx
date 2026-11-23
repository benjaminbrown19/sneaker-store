import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import Mensaje from '../../components/atoms/Mensaje'
import TablaProductos from '../../components/organisms/TablaProductos'
import { useSesion } from '../../context/SesionContext'
import { productosApi } from '../../services/productosApi'
export default function Productos() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'administrador'
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { let vivo = true; productosApi.listar().then(datos => { if(vivo) setProductos(datos) }).catch(e=> { if(vivo) setError(e.message) }); return () => {vivo=false} }, [])
  async function eliminar(codigo) {
    if (!esAdmin || !window.confirm(`¿Eliminar el producto ${codigo}?`)) return
    try { await productosApi.eliminar(codigo); setProductos(prev=>prev.filter(p=>p.codigo!==codigo)); setError('') }
    catch (e) { setError(e.message) }
  }
  return <>
    <TituloSeccion titulo="Productos" subtitulo="Inventario de la tienda (API REST)." />
    {error && <Mensaje variante="danger">{error}</Mensaje>}
    <div className="d-flex gap-2 flex-wrap mb-3">
      {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-warning boton-grip">Nuevo producto</Link>}
      {esAdmin && <Link to="/admin/productos/criticos" className="btn btn-outline-dark boton-grip">Productos críticos</Link>}
    </div>
    <TablaProductos productos={productos} puedeEditar={esAdmin} onEliminar={eliminar} />
  </>
}
