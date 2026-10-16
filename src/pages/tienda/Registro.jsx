import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioUsuario from '../../components/organisms/FormularioUsuario'
import { usuariosService } from '../../services/usuariosService'

export default function Registro() {
  function registrar({ password, ...datos }) {
    return usuariosService.registrar({ ...datos, tipoUsuario: 'cliente' })
  }

  return (
    <Container className="seccion-grip contenedor-formulario">
      <TituloSeccion titulo="Crear cuenta" subtitulo="Regístrate para comprar más rápido." />
      <FormularioUsuario
        conPassword
        reiniciarAlGuardar
        textoBoton="Crear cuenta"
        textoExito="Cuenta creada correctamente. Ya puedes iniciar sesión."
        onGuardar={registrar}
      />
      <p className="mt-3">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </Container>
  )
}
