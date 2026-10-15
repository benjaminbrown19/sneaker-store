import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Boton from '../atoms/Boton'
import Insignia from '../atoms/Insignia'
import Precio from '../atoms/Precio'

export default function TarjetaProducto({ producto, onAgregar }) {
  const sinStock = producto.stock <= 0
  const enOferta = Number(producto.descuento) > 0

  return (
    <Card as="article" className="tarjeta-producto h-100">
      <Link to={`/productos/${producto.codigo}`} className="tarjeta-producto-imagen" tabIndex={-1} aria-hidden="true">
        <Card.Img variant="top" src={producto.imagen} alt="" loading="lazy" />
        {enOferta && <Insignia tono="oferta" className="tarjeta-producto-oferta">-{producto.descuento}%</Insignia>}
      </Link>
      <Card.Body className="d-flex flex-column">
        <small className="codigo-producto">{producto.codigo}</small>
        <Card.Title as="h3" className="h5">
          <Link to={`/productos/${producto.codigo}`}>{producto.nombre}</Link>
        </Card.Title>
        <Precio precio={producto.precio} descuento={producto.descuento} />
        <Boton className="mt-auto" deshabilitado={sinStock} onClick={() => onAgregar(producto.codigo)}>
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        </Boton>
      </Card.Body>
    </Card>
  )
}
