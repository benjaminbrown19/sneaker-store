import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import { useFormulario } from '../../hooks/useFormulario'
import { validarEmail } from '../../utils/validaciones'

const reglas = {
  correo: validarEmail,
  password: (valor) => {
    if (!valor) return 'La contraseña es obligatoria.'
    if (valor.length < 8) return 'Introduce al menos 8 caracteres.'
    return null
  },
}

export default function FormularioLogin({ onIniciar }) {
  const { valores, campo, validarTodo } = useFormulario({ correo: '', password: '' }, reglas)
  const [fallo, setFallo] = useState(null)

  async function enviar(evento) {
    evento.preventDefault()
    setFallo(null)
    if (!validarTodo()) return

    const resultado = await onIniciar(valores.correo, valores.password)
    if (!resultado.ok) setFallo(resultado.error || 'No fue posible iniciar sesión. Revisa tus datos.')
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
