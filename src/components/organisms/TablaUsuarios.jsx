import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Boton from '../atoms/Boton'
import Insignia from '../atoms/Insignia'
import Mensaje from '../atoms/Mensaje'
import { capitalizar } from '../../utils/formato'

const TONOS_ROL = { administrador: 'info', vendedor: 'ok', cliente: 'neutro' }

export default function TablaUsuarios({ usuarios, onEliminar }) {
  if (usuarios.length === 0) {
    return <Mensaje variante="light">No hay usuarios para mostrar.</Mensaje>
  }

  return (
    <Table responsive striped hover className="tabla-admin align-middle">
      <caption className="visually-hidden">Listado de usuarios</caption>
      <thead>
        <tr>
          <th scope="col">RUN</th>
          <th scope="col">Nombre</th>
          <th scope="col">Correo</th>
          <th scope="col">Tipo</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td className="dato-mono">{usuario.run}</td>
            <td>{usuario.nombre} {usuario.apellidos}</td>
            <td>{usuario.correo}</td>
            <td><Insignia tono={TONOS_ROL[usuario.tipoUsuario] ?? 'neutro'}>{capitalizar(usuario.tipoUsuario)}</Insignia></td>
            <td>
              <div className="d-flex gap-2 flex-wrap">
                <Link to={`/admin/usuarios/${usuario.id}`} className="btn btn-sm btn-outline-dark">Ver</Link>
                <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-sm btn-outline-dark">Editar</Link>
                <Link to={`/admin/usuarios/${usuario.id}/historial`} className="btn btn-sm btn-outline-dark">Historial</Link>
                <Boton variante="peligro" tamano="sm" onClick={() => onEliminar(usuario.id)}>Eliminar</Boton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
