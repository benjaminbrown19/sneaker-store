import { Link, useNavigate, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioUsuario from '../../components/organisms/FormularioUsuario'
import { usuariosService } from '../../services/usuariosService'

export default function UsuarioEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const usuario = usuariosService.obtener(id)

  if (!usuario) {
    return (
      <>
        <Mensaje variante="danger">No se encontró el usuario.</Mensaje>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </>
    )
  }

  function guardar(datos) {
    const otro = usuariosService.buscarPorCorreo(datos.correo)
    if (otro && otro.id !== id) return { ok: false, error: 'Ya existe otro usuario con ese correo.' }
    const resultado = usuariosService.actualizar(id, datos)
    if (resultado.ok) navigate('/admin/usuarios')
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo={`Editar a ${usuario.nombre} ${usuario.apellidos}`} />
      <FormularioUsuario
        valoresIniciales={usuario}
        conTipo
        runBloqueado
        textoBoton="Guardar cambios"
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/usuarios')}
      />
    </>
  )
}
