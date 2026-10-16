import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Boton from '../../components/atoms/Boton'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioCupon from '../../components/molecules/FormularioCupon'
import ResumenCompra from '../../components/molecules/ResumenCompra'
import CarritoDetalle from '../../components/organisms/CarritoDetalle'
import { useCarrito } from '../../context/CarritoContext'
import { ENVIO_GRATIS_DESDE } from '../../data/cupones'
import { formatearPrecio } from '../../utils/formato'

export default function Carrito() {
  const navigate = useNavigate()
  const { lineas, cupon, resumen, cambiarCantidad, quitar, vaciar, aplicarCupon, quitarCupon } = useCarrito()
  const vacio = lineas.length === 0

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Carrito de compras" />
      <Row className="g-4">
        <Col lg={8}>
          <CarritoDetalle lineas={lineas} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />
          {!vacio && (
            <Boton variante="secundario" tamano="sm" className="mt-3" onClick={vaciar}>
              Vaciar carrito
            </Boton>
          )}
        </Col>
        <Col lg={4}>
          <aside className="panel-resumen" aria-label="Resumen del pedido">
            <h2 className="h5">Resumen</h2>
            <ResumenCompra resumen={resumen} cupon={cupon} />
            {!vacio && resumen.subtotal >= ENVIO_GRATIS_DESDE && (
              <Mensaje variante="success" className="py-2">¡Tu pedido califica para envío gratis!</Mensaje>
            )}
            {!vacio && resumen.subtotal < ENVIO_GRATIS_DESDE && (
              <p className="text-muted">Envío gratis desde {formatearPrecio(ENVIO_GRATIS_DESDE)}.</p>
            )}
            <FormularioCupon cupon={cupon} onAplicar={aplicarCupon} onQuitar={quitarCupon} />
            <Boton className="w-100 mt-3" tamano="lg" deshabilitado={vacio} onClick={() => navigate('/checkout')}>
              Continuar al pago
            </Boton>
          </aside>
        </Col>
      </Row>
    </Container>
  )
}
