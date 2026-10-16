import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'

export default function TablaCategorias({ categorias, conteos = {}, onEliminar }) {
  if (categorias.length === 0) {
    return <Mensaje variante="light">No hay categorías para mostrar.</Mensaje>
  }

  return (
    <Table responsive striped hover className="tabla-admin align-middle">
      <caption className="visually-hidden">Listado de categorías</caption>
      <thead>
        <tr>
          <th scope="col">Identificador</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col" className="text-end">Productos</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td className="dato-mono">{categoria.id}</td>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
            <td className="text-end dato-mono">{conteos[categoria.id] ?? 0}</td>
            <td>
              <div className="d-flex gap-2 flex-wrap">
                <Link to={`/admin/categorias/${categoria.id}/editar`} className="btn btn-sm btn-outline-dark">Editar</Link>
                <Boton variante="peligro" tamano="sm" onClick={() => onEliminar(categoria.id)}>Eliminar</Boton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
