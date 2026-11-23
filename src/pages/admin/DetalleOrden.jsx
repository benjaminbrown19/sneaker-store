import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import BoletaOrden from '../../components/organisms/BoletaOrden'
import { ordenesApi } from '../../services/ordenesApi'

export default function DetalleOrden() {
  const { id } = useParams()
  const [orden, setOrden] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    ordenesApi.obtener(id)
      .then((datos) => {
        if (activo) setOrden(datos)
      })
      .catch((solicitudError) => {
        if (activo) setError(solicitudError.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => { activo = false }
  }, [id])

  return (
    <>
      <TituloSeccion titulo="Boleta" subtitulo="Detalle de la orden seleccionada." />
      {cargando && <Mensaje variante="info">Consultando la orden…</Mensaje>}
      {error && <Mensaje variante="danger">{error}</Mensaje>}
      {!cargando && !error && orden && <BoletaOrden orden={orden} />}
      <p className="mt-3"><Link to="/admin/ordenes">← Volver a órdenes</Link></p>
    </>
  )
}
