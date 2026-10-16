import { Link, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import BoletaOrden from '../../components/organisms/BoletaOrden'
import { ordenesService } from '../../services/ordenesService'

export default function DetalleOrden() {
  const { id } = useParams()
  const orden = ordenesService.obtener(id)

  return (
    <>
      <TituloSeccion titulo="Boleta" subtitulo="Detalle de la orden seleccionada." />
      {orden ? <BoletaOrden orden={orden} /> : <Mensaje variante="danger">No se encontró esa orden.</Mensaje>}
      <p className="mt-3"><Link to="/admin/ordenes">← Volver a órdenes</Link></p>
    </>
  )
}
