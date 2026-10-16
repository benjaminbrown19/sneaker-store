import { Link, useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Mensaje from '../../components/atoms/Mensaje'

export default function PagoError() {
  const { state } = useLocation()
  const motivo = state?.motivo ?? 'No pudimos procesar el pago.'

  return (
    <Container className="seccion-grip contenedor-articulo">
      <Mensaje variante="danger">
        <strong>No se pudo realizar el pago.</strong> {motivo}
      </Mensaje>
      <p>Tu carrito sigue intacto. Revisa los datos de la tarjeta e inténtalo nuevamente.</p>
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/checkout" className="btn btn-warning boton-grip">Volver al checkout</Link>
        <Link to="/carrito" className="btn btn-outline-dark boton-grip">Ver carrito</Link>
      </div>
    </Container>
  )
}
