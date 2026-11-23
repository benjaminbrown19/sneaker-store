import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioUsuario from '../../components/organisms/FormularioUsuario'
import { authApi } from '../../services/authApi'

export default function Registro() {
  async function registrar({ password, ...datos }) {
    try { await authApi.registro({ correo: datos.correo, nombre: datos.nombre, password }); return { ok: true } }
    catch (error) { return { ok: false, error: error.message } }
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
