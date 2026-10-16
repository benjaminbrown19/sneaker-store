import { formatearPrecio, precioFinal } from '../../utils/formato'

export default function Precio({ precio, descuento = 0, className = '' }) {
  const enOferta = Number(descuento) > 0
  const final = precioFinal({ precio, descuento })

  return (
    <p className={`precio-grip ${className}`.trim()}>
      <span className="precio-actual" data-testid="precio-actual">{formatearPrecio(final)}</span>
      {enOferta && (
        <del className="precio-anterior" data-testid="precio-anterior">{formatearPrecio(precio)}</del>
      )}
    </p>
  )
}
