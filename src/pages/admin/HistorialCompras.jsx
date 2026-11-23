import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { usuariosService } from '../../services/usuariosService'
import { ordenesApi } from '../../services/ordenesApi'

export default function HistorialCompras() {
  const { id } = useParams()
  const usuario = usuariosService.obtener(id)
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(Boolean(usuario))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!usuario) return undefined
    let activo = true
    ordenesApi.listarPorCorreo(usuario.correo)
      .then((datos) => {
        if (activo) setOrdenes(datos)
      })
      .catch((solicitudError) => {
        if (activo) setError(solicitudError.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => { activo = false }
  }, [usuario?.correo])

  if (!usuario) {
    return (
      <>
        <Mensaje variante="danger">No se encontró el usuario.</Mensaje>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </>
    )
  }

  return (
    <>
      <TituloSeccion titulo="Historial de compras" subtitulo={`${usuario.nombre} ${usuario.apellidos} · ${usuario.correo}`} />
      {cargando && <Mensaje variante="info">Consultando historial…</Mensaje>}
      {error && <Mensaje variante="danger">{error}</Mensaje>}
      {!cargando && !error && <TablaOrdenes ordenes={ordenes} />}
      <p className="mt-3"><Link to={`/admin/usuarios/${usuario.id}`}>← Volver al usuario</Link></p>
    </>
  )
}
