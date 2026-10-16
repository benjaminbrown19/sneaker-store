import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

export default function NoEncontrada() {
  return (
    <Container className="seccion-grip text-center">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-warning boton-grip">Ir al inicio</Link>
    </Container>
  )
}
