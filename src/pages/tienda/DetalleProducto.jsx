import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Boton from '../../components/atoms/Boton'
import Insignia from '../../components/atoms/Insignia'
import Mensaje from '../../components/atoms/Mensaje'
import Precio from '../../components/atoms/Precio'
import { productosService } from '../../services/productosService'
import { useAvisoCarrito } from '../../hooks/useAvisoCarrito'
import { capitalizar } from '../../utils/formato'

export default function DetalleProducto() {
  const { codigo } = useParams()
  const producto = productosService.obtener(codigo)
  const [cantidad, setCantidad] = useState(1)
  const { aviso, agregarConAviso } = useAvisoCarrito()

  if (!producto) {
    return (
      <Container className="seccion-grip">
        <Mensaje variante="danger">No se encontró el producto solicitado.</Mensaje>
        <Link to="/productos">Volver al catálogo</Link>
      </Container>
    )
  }

  const sinStock = producto.stock <= 0

  return (
    <Container className="seccion-grip">
      <nav aria-label="Ruta de navegación" className="mb-3">
        <Link to="/">Home</Link> / <Link to="/productos">Productos</Link> / {producto.nombre}
      </nav>
      <Row className="g-4">
        <Col md={6}>
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid detalle-imagen" />
        </Col>
        <Col md={6}>
          <Insignia tono="neutro">{capitalizar(producto.categoria)}</Insignia>
          <h1 className="mt-2">{producto.nombre}</h1>
          <p className="codigo-producto">{producto.codigo}</p>
          <Precio precio={producto.precio} descuento={producto.descuento} className="precio-grande" />
          <p>{producto.descripcion}</p>
          <p>
            {sinStock ? <Insignia tono="critico">Sin stock</Insignia> : <>Stock disponible: <strong>{producto.stock}</strong></>}
          </p>
          {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}
          <div className="d-flex gap-2 align-items-end flex-wrap">
            <Form.Group controlId="detalle-cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={producto.stock}
                value={cantidad}
                disabled={sinStock}
                onChange={(evento) => setCantidad(Math.max(1, parseInt(evento.target.value, 10) || 1))}
              />
            </Form.Group>
            <Boton deshabilitado={sinStock} onClick={() => agregarConAviso(producto.codigo, cantidad)}>
              Añadir al carrito
            </Boton>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
