import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioLogin from '../../components/organisms/FormularioLogin'
import { useSesion } from '../../context/SesionContext'

export default function Login() {
  const { iniciarSesion } = useSesion()
  const navigate = useNavigate()

  function iniciar(correo, password) {
    const resultado = iniciarSesion(correo, password)
    if (resultado.ok) navigate('/')
    return resultado
  }

  return (
    <Container className="seccion-grip contenedor-formulario contenedor-angosto">
      <TituloSeccion titulo="Iniciar sesión" subtitulo="Ingresa con tu correo y contraseña." />
      <FormularioLogin onIniciar={iniciar} />
      <p className="mt-3">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </Container>
  )
}
