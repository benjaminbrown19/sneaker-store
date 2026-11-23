import { useEffect, useState } from 'react'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import Mensaje from '../../components/atoms/Mensaje'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { ordenesApi } from '../../services/ordenesApi'

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    ordenesApi.listarRecientes()
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
  }, [])

  return (
    <>
      <TituloSeccion titulo="Órdenes y boletas" subtitulo="Compras y ventas registradas en la base de datos." />
      {cargando && <Mensaje variante="info">Consultando órdenes en MySQL…</Mensaje>}
      {error && <Mensaje variante="danger">{error}</Mensaje>}
      {!cargando && !error && <TablaOrdenes ordenes={ordenes} />}
    </>
  )
}
