import { Link, Navigate, Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Boton from '../atoms/Boton'
import MenuLateralAdmin from '../organisms/MenuLateralAdmin'
import { useSesion } from '../../context/SesionContext'
import { capitalizar } from '../../utils/formato'

export default function PlantillaAdmin() {
  const { sesion, esPersonal, cerrarSesion } = useSesion()

  if (!sesion || !esPersonal) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="plantilla-admin">
      <header className="barra-admin">
        <Container fluid className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="logo-grip">GRIP<span className="logo-acento">.</span></Link>
            <span className="etiqueta-admin">Panel administrativo</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="usuario-admin">{sesion.nombre} · {capitalizar(sesion.rol)}</span>
            <Link to="/" className="btn btn-sm btn-outline-light">Volver a la tienda</Link>
            <Boton variante="primario" tamano="sm" onClick={cerrarSesion}>Cerrar sesión</Boton>
          </div>
        </Container>
      </header>
      <Container fluid>
        <Row>
          <Col xs={12} md={3} xl={2} className="columna-menu-admin">
            <MenuLateralAdmin rol={sesion.rol} />
          </Col>
          <Col xs={12} md={9} xl={10} as="main" className="contenido-admin">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
