import { Link, NavLink } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import Boton from '../atoms/Boton'

const ENLACES = [
  { a: '/', etiqueta: 'Home', exacto: true },
  { a: '/productos', etiqueta: 'Productos' },
  { a: '/categorias', etiqueta: 'Categorías' },
  { a: '/ofertas', etiqueta: 'Ofertas' },
  { a: '/nosotros', etiqueta: 'Nosotros' },
  { a: '/blogs', etiqueta: 'Blog' },
  { a: '/contacto', etiqueta: 'Contacto' },
]

export default function Encabezado({ cantidadCarrito = 0, sesion = null, onCerrarSesion }) {
  const esPersonal = sesion?.rol === 'administrador' || sesion?.rol === 'vendedor'

  return (
    <Navbar expand="lg" className="encabezado-grip" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo-grip">
          GRIP<span className="logo-acento">.</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú de navegación" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            {ENLACES.map((enlace) => (
              <Nav.Link key={enlace.a} as={NavLink} to={enlace.a} end={enlace.exacto}>
                {enlace.etiqueta}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            {!sesion && (
              <>
                <Nav.Link as={NavLink} to="/registro">Registrar usuario</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
              </>
            )}
            {sesion && (
              <>
                {esPersonal && (
                  <Nav.Link as={NavLink} to="/admin">Panel admin</Nav.Link>
                )}
                <Navbar.Text className="saludo-sesion">Hola, {sesion.nombre}</Navbar.Text>
                <Boton variante="secundario" tamano="sm" className="boton-salir" onClick={onCerrarSesion}>
                  Cerrar sesión
                </Boton>
              </>
            )}
            <Nav.Link
              as={NavLink}
              to="/carrito"
              aria-label={`Carrito de compras, ${cantidadCarrito} productos`}
              className="enlace-carrito"
            >
              Carrito{' '}
              <Badge bg="warning" text="dark" pill data-testid="contador-carrito">
                {cantidadCarrito}
              </Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
