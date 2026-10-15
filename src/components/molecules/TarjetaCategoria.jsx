import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

export default function TarjetaCategoria({ categoria, cantidad }) {
  return (
    <Card as="article" className="tarjeta-categoria h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h2" className="h4">{categoria.nombre}</Card.Title>
        <Card.Text>{categoria.descripcion}</Card.Text>
        <p className="tarjeta-categoria-cantidad mt-auto">
          {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
        </p>
        <Link to={`/categorias/${categoria.id}`} className="stretched-link">
          Ver {categoria.nombre}
        </Link>
      </Card.Body>
    </Card>
  )
}
