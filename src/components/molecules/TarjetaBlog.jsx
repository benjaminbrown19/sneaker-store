import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

export default function TarjetaBlog({ blog }) {
  return (
    <Card as="article" className="tarjeta-blog h-100">
      <Card.Img variant="top" src={blog.imagen} alt="" />
      <Card.Body className="d-flex flex-column">
        <small className="tarjeta-blog-categoria">{blog.categoria}</small>
        <Card.Title as="h2" className="h5">{blog.titulo}</Card.Title>
        <Card.Text>{blog.resumen}</Card.Text>
        <Link to={`/blogs/${blog.id}`} className="mt-auto stretched-link">Leer artículo</Link>
      </Card.Body>
    </Card>
  )
}
