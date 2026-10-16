import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import SelectorRegionComuna from '../molecules/SelectorRegionComuna'
import { useFormulario } from '../../hooks/useFormulario'
import { validarEmail, validarPassword, validarRUN, validarTexto } from '../../utils/validaciones'

export const USUARIO_VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  tipoUsuario: 'cliente',
  password: '',
  passwordConfirmar: '',
}

const OPCIONES_TIPO = [
  { valor: 'administrador', etiqueta: 'Administrador' },
  { valor: 'vendedor', etiqueta: 'Vendedor' },
  { valor: 'cliente', etiqueta: 'Cliente' },
]

function crearReglas({ conPassword, conTipo, runBloqueado }) {
  const reglas = {
    nombre: (valor) => validarTexto(valor, { max: 50, nombreCampo: 'El nombre' }),
    apellidos: (valor) => validarTexto(valor, { max: 100, nombreCampo: 'Los apellidos' }),
    correo: validarEmail,
    region: (valor) => (valor ? null : 'Selecciona una región.'),
    comuna: (valor) => (valor ? null : 'Selecciona una comuna.'),
    direccion: (valor) => validarTexto(valor, { max: 300, nombreCampo: 'La dirección' }),
  }
  if (!runBloqueado) {
    reglas.run = validarRUN
  }
  if (conTipo) {
    reglas.tipoUsuario = (valor) => (valor ? null : 'Selecciona un tipo de usuario.')
  }
  if (conPassword) {
    reglas.password = validarPassword
    reglas.passwordConfirmar = (valor, todos) => {
      if (!valor) return 'Debes confirmar tu contraseña.'
      return valor === todos.password ? null : 'Las contraseñas no coinciden.'
    }
  }
  return reglas
}

export default function FormularioUsuario({
  valoresIniciales = USUARIO_VACIO,
  onGuardar,
  onCancelar,
  textoBoton = 'Guardar',
  textoExito = 'Los datos se guardaron correctamente.',
  conPassword = false,
  conTipo = false,
  runBloqueado = false,
  reiniciarAlGuardar = false,
}) {
  const formulario = useFormulario({ ...USUARIO_VACIO, ...valoresIniciales }, crearReglas({ conPassword, conTipo, runBloqueado }))
  const { valores, campo, cambiar, validarTodo, reiniciar } = formulario
  const [resultado, setResultado] = useState(null)

  function enviar(evento) {
    evento.preventDefault()
    setResultado(null)
    if (!validarTodo()) return

    const { passwordConfirmar, ...datos } = valores
    const respuesta = onGuardar(datos)
    setResultado(respuesta)
    if (respuesta.ok && reiniciarAlGuardar) reiniciar(USUARIO_VACIO)
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de usuario">
      {resultado && !resultado.ok && <Mensaje variante="danger">{resultado.error}</Mensaje>}
      {resultado && resultado.ok && <Mensaje variante="success">{textoExito}</Mensaje>}

      <Row>
        <Col md={6}>
          <CampoFormulario
            {...campo('run', 'usuario-run')}
            etiqueta="RUN"
            deshabilitado={runBloqueado}
            ayuda="Sin puntos ni guion. Ej: 201234567"
          />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('fechaNacimiento', 'usuario-fecha')} etiqueta="Fecha de nacimiento (opcional)" tipo="date" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('nombre', 'usuario-nombre')} etiqueta="Nombre" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('apellidos', 'usuario-apellidos')} etiqueta="Apellidos" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('correo', 'usuario-correo')} etiqueta="Correo electrónico" tipo="email" />
        </Col>
        {conTipo && (
          <Col md={6}>
            <CampoFormulario
              {...campo('tipoUsuario', 'usuario-tipo')}
              etiqueta="Tipo de usuario"
              opciones={OPCIONES_TIPO}
            />
          </Col>
        )}
        <Col md={6}>
          <SelectorRegionComuna
            prefijo="usuario"
            campoRegion={campo('region')}
            campoComuna={campo('comuna')}
            onCambiarRegion={(region) => cambiar('region', region, { comuna: '' })}
          />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('direccion', 'usuario-direccion')} etiqueta="Dirección" />
        </Col>
        {conPassword && (
          <>
            <Col md={6}>
              <CampoFormulario {...campo('password', 'usuario-password')} etiqueta="Contraseña" tipo="password" ayuda="Entre 4 y 10 caracteres." />
            </Col>
            <Col md={6}>
              <CampoFormulario {...campo('passwordConfirmar', 'usuario-password-confirmar')} etiqueta="Confirmar contraseña" tipo="password" />
            </Col>
          </>
        )}
      </Row>

      <div className="d-flex gap-2 flex-wrap">
        <Boton tipo="submit">{textoBoton}</Boton>
        {onCancelar && <Boton variante="secundario" onClick={onCancelar}>Cancelar</Boton>}
      </div>
    </Form>
  )
}
