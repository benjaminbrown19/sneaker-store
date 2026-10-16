import { useNavigate } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioUsuario from '../../components/organisms/FormularioUsuario'
import { usuariosService } from '../../services/usuariosService'

export default function UsuarioNuevo() {
  const navigate = useNavigate()

  function guardar({ password, ...datos }) {
    const resultado = usuariosService.registrar(datos)
    if (resultado.ok) navigate('/admin/usuarios')
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo="Nuevo usuario" />
      <FormularioUsuario
        conPassword
        conTipo
        textoBoton="Crear usuario"
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/usuarios')}
      />
    </>
  )
}
