import { formatearPrecio } from '../../utils/formato'

export default function ResumenCompra({ resumen, cupon }) {
  return (
    <dl className="resumen-compra">
      <div className="resumen-fila">
        <dt>Subtotal</dt>
        <dd data-testid="resumen-subtotal">{formatearPrecio(resumen.subtotal)}</dd>
      </div>
      {resumen.descuento > 0 && (
        <div className="resumen-fila resumen-descuento">
          <dt>Cupón {cupon?.codigo}</dt>
          <dd data-testid="resumen-descuento">-{formatearPrecio(resumen.descuento)}</dd>
        </div>
      )}
      <div className="resumen-fila">
        <dt>Envío</dt>
        <dd data-testid="resumen-envio">{resumen.envio === 0 ? 'Gratis' : formatearPrecio(resumen.envio)}</dd>
      </div>
      <div className="resumen-fila resumen-total">
        <dt>Total</dt>
        <dd data-testid="resumen-total">{formatearPrecio(resumen.total)}</dd>
      </div>
    </dl>
  )
}
