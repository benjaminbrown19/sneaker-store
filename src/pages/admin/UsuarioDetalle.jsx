import { Link, useParams } from 'react-router-dom'
import Insignia from '../../components/atoms/Insignia'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import { regiones } from '../../data/regiones'
import { usuariosService } from '../../services/usuariosService'
import { capitalizar } from '../../utils/formato'

export default function UsuarioDetalle() {
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

  const region = regiones.find((candidata) => candidata.valor === usuario.region)

  return (
    <>
      <TituloSeccion titulo={`${usuario.nombre} ${usuario.apellidos}`} subtitulo={usuario.correo} />
      <dl className="ficha-datos">
        <dt>RUN</dt>
        <dd className="dato-mono">{usuario.run}</dd>
        <dt>Tipo de usuario</dt>
        <dd><Insignia tono="info">{capitalizar(usuario.tipoUsuario)}</Insignia></dd>
        <dt>Fecha de nacimiento</dt>
        <dd>{usuario.fechaNacimiento || 'No informada'}</dd>
        <dt>Región</dt>
        <dd>{region ? region.nombre : usuario.region}</dd>
        <dt>Comuna</dt>
        <dd>{usuario.comuna}</dd>
        <dt>Dirección</dt>
        <dd>{usuario.direccion}</dd>
      </dl>
      <div className="d-flex gap-2 flex-wrap">
        <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-warning boton-grip">Editar</Link>
        <Link to={`/admin/usuarios/${usuario.id}/historial`} className="btn btn-outline-dark boton-grip">Historial de compras</Link>
        <Link to="/admin/usuarios" className="btn btn-outline-dark boton-grip">Volver</Link>
      </div>
    </>
  )
}
