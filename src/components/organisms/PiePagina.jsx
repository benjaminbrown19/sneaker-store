import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import { validarEmail } from '../../utils/validaciones'

export default function PiePagina({ categorias = [] }) {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState(null)

  function suscribir(evento) {
    evento.preventDefault()
    const error = validarEmail(correo)
    if (error) {
      setMensaje({ ok: false, texto: error })
      return
    }
    setMensaje({ ok: true, texto: '¡Gracias por suscribirte! Te avisaremos de nuevos lanzamientos.' })
    setCorreo('')
  }

  return (
    <footer className="pie-grip">
      <Container>
        <Row className="gy-4">
          <Col md={6} lg={4}>
            <p className="logo-grip">GRIP<span className="logo-acento">.</span></p>
            <p>Zapatillas urbanas y deportivas con envío a todo Chile.</p>
            <p className="mb-0">Pagos con tarjeta de crédito y débito.</p>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <h2 className="h6">Categorías</h2>
            <ul className="list-unstyled">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <Link to={`/categorias/${categoria.id}`}>{categoria.nombre}</Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <h2 className="h6">Contacto</h2>
            <ul className="list-unstyled">
              <li>contacto@grip-sneakers.cl</li>
              <li>+56 9 1234 5678</li>
              <li>Valparaíso, Chile</li>
            </ul>
          </Col>
          <Col lg={4}>
            <h2 className="h6">Novedades</h2>
            <Form onSubmit={suscribir} noValidate aria-label="Suscripción al newsletter">
              <Form.Label htmlFor="newsletter-correo" className="visually-hidden">Correo para recibir novedades</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  id="newsletter-correo"
                  type="email"
                  placeholder="tu@correo.cl"
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                />
                <Boton tipo="submit">Suscribirme</Boton>
              </div>
              {mensaje && (
                <p className={mensaje.ok ? 'pie-exito' : 'pie-error'} role="status">{mensaje.texto}</p>
              )}
            </Form>
          </Col>
        </Row>
        <p className="pie-copy">© 2026 GRIP Sneaker Store. Proyecto académico Duoc UC.</p>
      </Container>
    </footer>
  )
}
