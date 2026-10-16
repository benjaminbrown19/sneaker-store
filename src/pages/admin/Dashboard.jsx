import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TarjetaMetrica from '../../components/molecules/TarjetaMetrica'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { useSesion } from '../../context/SesionContext'
import { productosService } from '../../services/productosService'
import { usuariosService } from '../../services/usuariosService'
import { ordenesService } from '../../services/ordenesService'
import { formatearPrecio } from '../../utils/formato'

export default function Dashboard() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'administrador'
  const productos = productosService.listar()
  const criticos = productosService.listarCriticos()
  const ordenes = ordenesService.listarRecientes()
  const ventas = ordenes.reduce((suma, orden) => suma + orden.total, 0)

  return (
    <>
      <TituloSeccion titulo="Dashboard" subtitulo="Resumen general del inventario y la operación de la tienda." />
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><TarjetaMetrica etiqueta="Productos totales" valor={productos.length} /></Col>
        <Col><TarjetaMetrica etiqueta="Productos con stock crítico" valor={criticos.length} tono="alerta" /></Col>
        <Col><TarjetaMetrica etiqueta="Órdenes" valor={ordenes.length} /></Col>
        {esAdmin && (
          <Col><TarjetaMetrica etiqueta="Usuarios" valor={usuariosService.listar().length} /></Col>
        )}
        {esAdmin && (
          <Col><TarjetaMetrica etiqueta="Ventas acumuladas" valor={formatearPrecio(ventas)} tono="exito" /></Col>
        )}
      </Row>
      <h2 className="h5">Últimas órdenes</h2>
      <TablaOrdenes ordenes={ordenes.slice(0, 5)} />
      <p><Link to="/admin/ordenes">Ver todas las órdenes →</Link></p>
    </>
  )
}
