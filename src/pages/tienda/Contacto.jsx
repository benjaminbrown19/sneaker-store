import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioContacto from '../../components/organisms/FormularioContacto'
import { leer, guardar } from '../../services/almacen'

export const CLAVE_MENSAJES = 'grip_mensajes'

export default function Contacto() {
  function enviar(mensaje) {
    guardar(CLAVE_MENSAJES, [...leer(CLAVE_MENSAJES, []), { ...mensaje, fecha: new Date().toISOString() }])
  }

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Contacto" subtitulo="¿Dudas, sugerencias o problemas con tu pedido? Escríbenos." />
      <Row className="g-4">
        <Col md={7}>
          <h2 className="h5">Envíanos un mensaje</h2>
          <FormularioContacto onEnviar={enviar} />
        </Col>
        <Col md={5}>
          <h2 className="h5">Otros medios</h2>
          <ul className="list-unstyled">
            <li>contacto@grip-sneakers.cl</li>
            <li>+56 9 1234 5678</li>
            <li>Valparaíso, Chile</li>
          </ul>
        </Col>
      </Row>
    </Container>
  )
}
