import { Link, Navigate, useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Mensaje from '../../components/atoms/Mensaje'
import BoletaOrden from '../../components/organisms/BoletaOrden'

export default function PagoExitoso() {
  const { state } = useLocation()
  // La orden que se muestra es exactamente la respuesta devuelta por Spring Boot.
  const orden = state?.orden || null

  if (!orden) return <Navigate to="/" replace />

  return (
    <Container className="seccion-grip contenedor-articulo">
      <Mensaje variante="success">
        <strong>¡Compra realizada con éxito!</strong> Gracias por comprar en GRIP. Este es el resumen de tu pedido.
      </Mensaje>
      <BoletaOrden orden={orden} />
      <p className="mt-4">
        <Link to="/productos" className="btn btn-warning boton-grip">Seguir comprando</Link>
      </p>
    </Container>
  )
}
