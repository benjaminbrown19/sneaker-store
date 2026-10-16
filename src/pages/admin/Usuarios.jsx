import { useState } from 'react'
import { Link } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaUsuarios from '../../components/organisms/TablaUsuarios'
import { useSesion } from '../../context/SesionContext'
import { usuariosService } from '../../services/usuariosService'

export default function Usuarios() {
  const { sesion } = useSesion()
  const [usuarios, setUsuarios] = useState(() => usuariosService.listar())

  function eliminar(id) {
    const usuario = usuariosService.obtener(id)
    if (usuario && usuario.correo.toLowerCase() === sesion.correo.toLowerCase()) {
      window.alert('No puedes eliminar tu propia cuenta mientras tienes la sesión iniciada.')
      return
    }
    if (!window.confirm('¿Eliminar este usuario?')) return
    usuariosService.eliminar(id)
    setUsuarios(usuariosService.listar())
  }

  return (
    <>
      <TituloSeccion titulo="Usuarios" subtitulo="Cuentas registradas en la tienda." />
      <p>
        <Link to="/admin/usuarios/nuevo" className="btn btn-warning boton-grip">Nuevo usuario</Link>
      </p>
      <TablaUsuarios usuarios={usuarios} onEliminar={eliminar} />
    </>
  )
}
