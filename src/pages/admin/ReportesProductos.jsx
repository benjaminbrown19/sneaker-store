import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TarjetaMetrica from '../../components/molecules/TarjetaMetrica'
import { productosService } from '../../services/productosService'
import { categoriasService } from '../../services/categoriasService'
import { formatearPrecio, precioFinal } from '../../utils/formato'

export default function ReportesProductos() {
  const productos = productosService.listar()
  const categorias = categoriasService.listar()
  const valorInventario = productos.reduce((suma, producto) => suma + precioFinal(producto) * producto.stock, 0)
  const unidades = productos.reduce((suma, producto) => suma + producto.stock, 0)

  const filas = categorias.map((categoria) => {
    const delGrupo = productos.filter((producto) => producto.categoria === categoria.id)
    return {
      categoria: categoria.nombre,
      productos: delGrupo.length,
      unidades: delGrupo.reduce((suma, producto) => suma + producto.stock, 0),
      valor: delGrupo.reduce((suma, producto) => suma + precioFinal(producto) * producto.stock, 0),
    }
  })

  return (
    <>
      <TituloSeccion titulo="Reportes de productos" subtitulo="Inventario valorizado por categoría." />
      <Row xs={1} sm={3} className="g-3 mb-4">
        <Col><TarjetaMetrica etiqueta="Unidades en stock" valor={unidades} /></Col>
        <Col><TarjetaMetrica etiqueta="Valor del inventario" valor={formatearPrecio(valorInventario)} tono="exito" /></Col>
        <Col><TarjetaMetrica etiqueta="Productos en oferta" valor={productosService.listarOfertas().length} /></Col>
      </Row>
      <Table responsive striped className="tabla-admin">
        <caption className="visually-hidden">Inventario por categoría</caption>
        <thead>
          <tr>
            <th scope="col">Categoría</th>
            <th scope="col" className="text-end">Productos</th>
            <th scope="col" className="text-end">Unidades</th>
            <th scope="col" className="text-end">Valor</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.categoria}>
              <td>{fila.categoria}</td>
              <td className="text-end dato-mono">{fila.productos}</td>
              <td className="text-end dato-mono">{fila.unidades}</td>
              <td className="text-end dato-mono">{formatearPrecio(fila.valor)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
