import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import { useFormulario } from '../../hooks/useFormulario'
import { validarEmail, validarPassword } from '../../utils/validaciones'

const reglas = {
  correo: validarEmail,
  password: validarPassword,
}

export default function FormularioLogin({ onIniciar }) {
  const { valores, campo, validarTodo } = useFormulario({ correo: '', password: '' }, reglas)
  const [fallo, setFallo] = useState(null)

  function enviar(evento) {
    evento.preventDefault()
    setFallo(null)
    if (!validarTodo()) return

    const resultado = onIniciar(valores.correo, valores.password)
    if (!resultado.ok) setFallo('No fue posible iniciar sesión. Revisa tus datos.')
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de inicio de sesión">
      {fallo && <Mensaje variante="danger">{fallo}</Mensaje>}
      <CampoFormulario {...campo('correo', 'login-correo')} etiqueta="Correo electrónico" tipo="email" />
      <CampoFormulario {...campo('password', 'login-password')} etiqueta="Contraseña" tipo="password" />
      <Boton tipo="submit" className="w-100">Iniciar sesión</Boton>
    </Form>
  )
}
