import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Boton from '../atoms/Boton'
import CampoFormulario from '../molecules/CampoFormulario'
import SelectorRegionComuna from '../molecules/SelectorRegionComuna'
import { useFormulario } from '../../hooks/useFormulario'
import { validarEmail, validarTarjeta, validarTexto } from '../../utils/validaciones'

export const CHECKOUT_VACIO = {
  nombre: '',
  apellidos: '',
  correo: '',
  region: '',
  comuna: '',
  direccion: '',
  tarjeta: '',
}

function crearReglas(tipoEntrega) {
  const aDomicilio = tipoEntrega === 'domicilio'
  return {
    nombre: (valor) => validarTexto(valor, { max: 50, nombreCampo: 'El nombre' }),
    apellidos: (valor) => validarTexto(valor, { max: 100, nombreCampo: 'Los apellidos' }),
    correo: validarEmail,
    region: (valor) => (aDomicilio && !valor ? 'Selecciona una región.' : null),
    comuna: (valor) => (aDomicilio && !valor ? 'Selecciona una comuna.' : null),
    direccion: (valor) =>
      aDomicilio ? validarTexto(valor, { max: 300, nombreCampo: 'La dirección' }) : null,
    tarjeta: validarTarjeta,
  }
}

export default function FormularioCheckout({
  valoresIniciales = CHECKOUT_VACIO,
  tipoEntrega,
  onCambiarTipoEntrega,
  onPagar,
}) {
  const { valores, campo, cambiar, validarTodo } = useFormulario(
    { ...CHECKOUT_VACIO, ...valoresIniciales },
    crearReglas(tipoEntrega),
  )

  function enviar(evento) {
    evento.preventDefault()
    if (!validarTodo()) return
    onPagar(valores)
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de checkout">
      <h2 className="h5">Tus datos</h2>
      <Row>
        <Col md={6}>
          <CampoFormulario {...campo('nombre', 'checkout-nombre')} etiqueta="Nombre" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('apellidos', 'checkout-apellidos')} etiqueta="Apellidos" />
        </Col>
      </Row>
      <CampoFormulario {...campo('correo', 'checkout-correo')} etiqueta="Correo electrónico" tipo="email" />

      <h2 className="h5 mt-4">Entrega</h2>
      <div className="mb-3" role="radiogroup" aria-label="Opciones de entrega">
        <Form.Check
          type="radio"
          id="entrega-domicilio"
          name="tipoEntrega"
          label="Despacho a domicilio"
          checked={tipoEntrega === 'domicilio'}
          onChange={() => onCambiarTipoEntrega('domicilio')}
        />
        <Form.Check
          type="radio"
          id="entrega-retiro"
          name="tipoEntrega"
          label="Retiro en tienda (gratis)"
          checked={tipoEntrega === 'retiro'}
          onChange={() => onCambiarTipoEntrega('retiro')}
        />
      </div>

      {tipoEntrega === 'domicilio' && (
        <Row>
          <Col md={6}>
            <SelectorRegionComuna
              prefijo="checkout"
              campoRegion={campo('region')}
              campoComuna={campo('comuna')}
              onCambiarRegion={(region) => cambiar('region', region, { comuna: '' })}
            />
          </Col>
          <Col md={6}>
            <CampoFormulario {...campo('direccion', 'checkout-direccion')} etiqueta="Dirección" />
          </Col>
        </Row>
      )}

      <h2 className="h5 mt-4">Pago</h2>
      <CampoFormulario
        {...campo('tarjeta', 'checkout-tarjeta')}
        etiqueta="Número de tarjeta"
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        ayuda="Simulación: una tarjeta terminada en 0000 será rechazada."
      />

      <Boton tipo="submit" tamano="lg" className="w-100">Pagar ahora</Boton>
    </Form>
  )
}
