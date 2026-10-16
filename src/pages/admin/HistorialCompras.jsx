import { Link, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { usuariosService } from '../../services/usuariosService'
import { ordenesService } from '../../services/ordenesService'

export default function HistorialCompras() {
  const { id } = useParams()
  const usuario = usuariosService.obtener(id)

  if (!usuario) {
    return (
      <>
        <Mensaje variante="danger">No se encontró el usuario.</Mensaje>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </>
    )
  }

  return (
    <>
      <TituloSeccion titulo="Historial de compras" subtitulo={`${usuario.nombre} ${usuario.apellidos} · ${usuario.correo}`} />
      <TablaOrdenes ordenes={[...ordenesService.listarPorCorreo(usuario.correo)].reverse()} />
      <p className="mt-3"><Link to={`/admin/usuarios/${usuario.id}`}>← Volver al usuario</Link></p>
    </>
  )
}
