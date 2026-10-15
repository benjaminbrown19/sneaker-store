import Boton from '../atoms/Boton'
import { formatearPrecio } from '../../utils/formato'

export default function ItemCarrito({ linea, onCambiarCantidad, onQuitar }) {
  const { producto, cantidad, precioUnitario, subtotal } = linea

  return (
    <article className="item-carrito" data-codigo={producto.codigo}>
      <img src={producto.imagen} alt={producto.nombre} className="item-carrito-imagen" />
      <div className="item-carrito-info">
        <h3 className="h6 mb-1">{producto.nombre}</h3>
        <p className="mb-0 text-muted">{formatearPrecio(precioUnitario)} c/u</p>
      </div>
      <div className="item-carrito-cantidad" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
        <Boton
          variante="secundario"
          tamano="sm"
          aria-label={`Disminuir cantidad de ${producto.nombre}`}
          onClick={() => onCambiarCantidad(producto.codigo, cantidad - 1)}
        >
          −
        </Boton>
        <output className="item-carrito-valor" aria-live="polite">{cantidad}</output>
        <Boton
          variante="secundario"
          tamano="sm"
          aria-label={`Aumentar cantidad de ${producto.nombre}`}
          deshabilitado={cantidad >= producto.stock}
          onClick={() => onCambiarCantidad(producto.codigo, cantidad + 1)}
        >
          +
        </Boton>
      </div>
      <p className="item-carrito-subtotal">{formatearPrecio(subtotal)}</p>
      <Boton variante="peligro" tamano="sm" onClick={() => onQuitar(producto.codigo)}>
        Eliminar
      </Boton>
    </article>
  )
}
