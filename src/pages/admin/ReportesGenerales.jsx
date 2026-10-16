import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TarjetaMetrica from '../../components/molecules/TarjetaMetrica'
import { ordenesService } from '../../services/ordenesService'
import { formatearPrecio } from '../../utils/formato'

export default function ReportesGenerales() {
  const ordenes = ordenesService.listar()
  const ventas = ordenes.reduce((suma, orden) => suma + orden.total, 0)
  const promedio = ordenes.length ? Math.round(ventas / ordenes.length) : 0
  const conCupon = ordenes.filter((orden) => orden.cupon).length

  const acumulado = {}
  ordenes.forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = acumulado[item.codigo] ?? { nombre: item.nombre, unidades: 0, monto: 0 }
      acumulado[item.codigo] = {
        nombre: item.nombre,
        unidades: actual.unidades + item.cantidad,
        monto: actual.monto + item.subtotal,
      }
    })
  })
  const masVendidos = Object.entries(acumulado)
    .map(([codigo, datos]) => ({ codigo, ...datos }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5)

  return (
    <>
      <TituloSeccion titulo="Reportes generales" subtitulo="Indicadores de ventas calculados desde las órdenes." />
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><TarjetaMetrica etiqueta="Órdenes" valor={ordenes.length} /></Col>
        <Col><TarjetaMetrica etiqueta="Ventas acumuladas" valor={formatearPrecio(ventas)} tono="exito" /></Col>
        <Col><TarjetaMetrica etiqueta="Ticket promedio" valor={formatearPrecio(promedio)} /></Col>
        <Col><TarjetaMetrica etiqueta="Órdenes con cupón" valor={conCupon} /></Col>
      </Row>
      <h2 className="h5">Productos más vendidos</h2>
      {masVendidos.length === 0 ? (
        <p className="text-muted">Aún no hay ventas registradas.</p>
      ) : (
        <Table responsive striped className="tabla-admin">
          <caption className="visually-hidden">Productos más vendidos</caption>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Producto</th>
              <th scope="col" className="text-end">Unidades</th>
              <th scope="col" className="text-end">Monto</th>
            </tr>
          </thead>
          <tbody>
            {masVendidos.map((fila) => (
              <tr key={fila.codigo}>
                <td className="dato-mono">{fila.codigo}</td>
                <td>{fila.nombre}</td>
                <td className="text-end dato-mono">{fila.unidades}</td>
                <td className="text-end dato-mono">{formatearPrecio(fila.monto)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
