import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Insignia from '../atoms/Insignia'
import ResumenCompra from '../molecules/ResumenCompra'
import { formatearFecha, formatearPrecio } from '../../utils/formato'

export default function BoletaOrden({ orden }) {
  const cupon = orden.cupon ? { codigo: orden.cupon } : null
  const entregaDomicilio = orden.entrega.tipo === 'domicilio'
  const esVendedor = orden.canal === 'vendedor'

  return (
    <Card as="article" className="boleta-orden" aria-label={`Boleta de la orden ${orden.id}`}>
      <Card.Body>
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <p className="boleta-id mb-0">Orden {orden.id}</p>
            <p className="text-muted mb-0">{formatearFecha(orden.fecha)}</p>
          </div>
          <Insignia tono="ok">Pagada</Insignia>
        </div>

        <dl className="boleta-datos">
          <dt>Cliente</dt>
          <dd>
            {orden.cliente.nombre} {orden.cliente.apellidos}
            {orden.cliente.correo ? ` (${orden.cliente.correo})` : ''}
          </dd>
          <dt>Canal de venta</dt>
          <dd>{esVendedor ? 'Venta en tienda, realizada por un vendedor' : 'Compra por internet'}</dd>
          {esVendedor && (
            <>
              <dt>Vendedor</dt>
              <dd>{orden.vendedor.nombre}</dd>
              <dt>RUT del vendedor</dt>
              <dd>{orden.vendedor.run}</dd>
              <dt>Correo del vendedor</dt>
              <dd>{orden.vendedor.correo}</dd>
            </>
          )}
          <dt>Entrega</dt>
          <dd>
            {entregaDomicilio
              ? `Despacho a domicilio: ${orden.entrega.direccion}, ${orden.entrega.comuna}`
              : 'Retiro en tienda'}
          </dd>
          <dt>Pago</dt>
          <dd>
            {orden.pago.metodo === 'presencial' ? 'Pago en tienda' : `Tarjeta terminada en ${orden.pago.ultimos4}`}
          </dd>
        </dl>

        <Table responsive size="sm" className="align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col" className="text-end">Cant.</th>
              <th scope="col" className="text-end">Precio</th>
              <th scope="col" className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.items.map((item) => (
              <tr key={item.codigo}>
                <td>{item.nombre}</td>
                <td className="text-end dato-mono">{item.cantidad}</td>
                <td className="text-end dato-mono">{formatearPrecio(item.precioUnitario)}</td>
                <td className="text-end dato-mono">{formatearPrecio(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ResumenCompra
          resumen={{ subtotal: orden.subtotal, descuento: orden.descuento, envio: orden.envio, total: orden.total }}
          cupon={cupon}
        />
      </Card.Body>
    </Card>
  )
}
