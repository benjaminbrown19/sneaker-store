import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioUsuario from '../../components/organisms/FormularioUsuario'
import { useSesion } from '../../context/SesionContext'
import { usuariosService } from '../../services/usuariosService'

export default function Perfil() {
  const { sesion, actualizarSesion } = useSesion()
  const usuario = usuariosService.buscarPorCorreo(sesion.correo)

  if (!usuario) {
    return (
      <>
        <TituloSeccion titulo="Mi perfil" />
        <Mensaje variante="info">Tu sesión no está asociada a una cuenta registrada, por lo que no hay datos que editar.</Mensaje>
      </>
    )
  }

  function guardar(datos) {
    const resultado = usuariosService.actualizar(usuario.id, { ...datos, tipoUsuario: usuario.tipoUsuario })
    if (resultado.ok) actualizarSesion({ nombre: datos.nombre.trim(), correo: datos.correo.trim() })
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo="Mi perfil" subtitulo="Actualiza tus datos personales." />
      <FormularioUsuario
        valoresIniciales={usuario}
        runBloqueado
        textoBoton="Guardar perfil"
        textoExito="Perfil actualizado correctamente."
        onGuardar={guardar}
      />
    </>
  )
}
