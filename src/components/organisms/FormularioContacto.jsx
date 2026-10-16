import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import { useFormulario } from '../../hooks/useFormulario'
import { validarEmail, validarTexto } from '../../utils/validaciones'

const reglas = {
  nombre: (valor) => validarTexto(valor, { max: 100, nombreCampo: 'El nombre' }),
  correo: validarEmail,
  comentario: (valor) => validarTexto(valor, { max: 500, nombreCampo: 'El comentario' }),
}

export default function FormularioContacto({ onEnviar }) {
  const { valores, campo, validarTodo, reiniciar } = useFormulario(
    { nombre: '', correo: '', comentario: '' },
    reglas,
  )
  const [enviado, setEnviado] = useState(false)

  function enviar(evento) {
    evento.preventDefault()
    setEnviado(false)
    if (!validarTodo()) return

    onEnviar(valores)
    reiniciar()
    setEnviado(true)
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de contacto">
      {enviado && <Mensaje variante="success">Mensaje enviado. Te responderemos pronto.</Mensaje>}
      <CampoFormulario {...campo('nombre', 'contacto-nombre')} etiqueta="Nombre" />
      <CampoFormulario {...campo('correo', 'contacto-correo')} etiqueta="Correo electrónico" tipo="email" />
      <CampoFormulario {...campo('comentario', 'contacto-comentario')} etiqueta="Comentario" tipo="textarea" />
      <Boton tipo="submit">Enviar mensaje</Boton>
    </Form>
  )
}
