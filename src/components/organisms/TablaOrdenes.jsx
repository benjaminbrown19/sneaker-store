import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Insignia from '../atoms/Insignia'
import Mensaje from '../atoms/Mensaje'
import { formatearFecha, formatearPrecio } from '../../utils/formato'

export default function TablaOrdenes({ ordenes, rutaBase = '/admin/ordenes' }) {
  if (ordenes.length === 0) {
    return (
      <Mensaje variante="light">
        Todavía no hay órdenes. Se crean cuando alguien completa una compra.
      </Mensaje>
    )
  }

  return (
    <Table responsive striped hover className="tabla-admin align-middle">
      <caption className="visually-hidden">Listado de órdenes</caption>
      <thead>
        <tr>
          <th scope="col">Orden</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cliente</th>
          <th scope="col" className="text-end">Unidades</th>
          <th scope="col" className="text-end">Total</th>
          <th scope="col">Estado</th>
          <th scope="col">Boleta</th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden.id}>
            <td className="dato-mono">{orden.id}</td>
            <td>{formatearFecha(orden.fecha)}</td>
            <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
            <td className="text-end dato-mono">{orden.items.reduce((suma, item) => suma + item.cantidad, 0)}</td>
            <td className="text-end dato-mono">{formatearPrecio(orden.total)}</td>
            <td><Insignia tono="ok">Pagada</Insignia></td>
            <td><Link to={`${rutaBase}/${orden.id}`} className="btn btn-sm btn-outline-dark">Mostrar boleta</Link></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
