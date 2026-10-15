import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Boton from '../atoms/Boton'
import Insignia from '../atoms/Insignia'
import Mensaje from '../atoms/Mensaje'
import { formatearPrecio, capitalizar } from '../../utils/formato'

export default function TablaProductos({ productos, puedeEditar = false, onEliminar }) {
  if (productos.length === 0) {
    return <Mensaje variante="light">No hay productos para mostrar.</Mensaje>
  }

  return (
    <Table responsive striped hover className="tabla-admin align-middle">
      <caption className="visually-hidden">Listado de productos</caption>
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Nombre</th>
          <th scope="col">Categoría</th>
          <th scope="col" className="text-end">Precio</th>
          <th scope="col" className="text-end">Stock</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => {
          const critico = producto.stock <= producto.stockCritico
          return (
            <tr key={producto.codigo}>
              <td className="dato-mono">{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{capitalizar(producto.categoria)}</td>
              <td className="text-end dato-mono">{formatearPrecio(producto.precio)}</td>
              <td className="text-end">
                <span className="dato-mono">{producto.stock}</span>{' '}
                {critico && <Insignia tono="critico">Crítico</Insignia>}
              </td>
              <td>
                <div className="d-flex gap-2 flex-wrap">
                  <Link to={`/admin/productos/${producto.codigo}`} className="btn btn-sm btn-outline-dark">
                    Ver
                  </Link>
                  {puedeEditar && (
                    <>
                      <Link to={`/admin/productos/${producto.codigo}/editar`} className="btn btn-sm btn-outline-dark">
                        Editar
                      </Link>
                      <Boton variante="peligro" tamano="sm" onClick={() => onEliminar(producto.codigo)}>
                        Eliminar
                      </Boton>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
