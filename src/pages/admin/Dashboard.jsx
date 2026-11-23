import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import Mensaje from '../../components/atoms/Mensaje'
import TarjetaMetrica from '../../components/molecules/TarjetaMetrica'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { useSesion } from '../../context/SesionContext'
import { productosApi } from '../../services/productosApi'
import { usuariosService } from '../../services/usuariosService'
import { ordenesApi } from '../../services/ordenesApi'
import { formatearPrecio } from '../../utils/formato'

export default function Dashboard() {
  const { sesion } = useSesion()
  const esAdmin = sesion?.rol === 'administrador'
  const [productos, setProductos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    Promise.all([productosApi.listar(), ordenesApi.listarRecientes()])
      .then(([catalogo, ventas]) => {
        if (!activo) return
        setProductos(catalogo)
        setOrdenes(ventas)
      })
      .catch((solicitudError) => {
        if (activo) setError(solicitudError.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => { activo = false }
  }, [])

  const criticos = productos.filter((producto) => Number(producto.stock) <= Number(producto.stockCritico))
  const ventas = ordenes.reduce((suma, orden) => suma + Number(orden.total || 0), 0)

  return (
    <>
      <TituloSeccion titulo="Dashboard" subtitulo="Resumen general del inventario y la operación de la tienda." />
      {cargando && <Mensaje variante="info">Consultando datos del backend…</Mensaje>}
      {error && <Mensaje variante="danger">{error}</Mensaje>}
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><TarjetaMetrica etiqueta="Productos totales" valor={productos.length} /></Col>
        <Col><TarjetaMetrica etiqueta="Productos con stock crítico" valor={criticos.length} tono="alerta" /></Col>
        <Col><TarjetaMetrica etiqueta="Órdenes" valor={ordenes.length} /></Col>
        {esAdmin && <Col><TarjetaMetrica etiqueta="Usuarios" valor={usuariosService.listar().length} /></Col>}
        {esAdmin && <Col><TarjetaMetrica etiqueta="Ventas acumuladas" valor={formatearPrecio(ventas)} tono="exito" /></Col>}
      </Row>
      <h2 className="h5">Últimas órdenes</h2>
      {!cargando && !error && <TablaOrdenes ordenes={ordenes.slice(0, 5)} />}
      <p><Link to="/admin/ordenes">Ver todas las órdenes →</Link></p>
    </>
  )
}
