import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Mensaje from '../atoms/Mensaje'
import TarjetaProducto from '../molecules/TarjetaProducto'

export default function ListaProductos({
  productos,
  onAgregar,
  mensajeVacio = 'No hay productos para mostrar.',
}) {
  if (productos.length === 0) {
    return <Mensaje variante="light">{mensajeVacio}</Mensaje>
  }

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4" role="list">
      {productos.map((producto) => (
        <Col key={producto.codigo} role="listitem">
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </Col>
      ))}
    </Row>
  )
}
