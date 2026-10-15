import { Link } from 'react-router-dom'
import ItemCarrito from '../molecules/ItemCarrito'

export default function CarritoDetalle({ lineas, onCambiarCantidad, onQuitar }) {
  if (lineas.length === 0) {
    return (
      <div className="carrito-vacio">
        <p>Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-warning boton-grip">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="carrito-lista">
      {lineas.map((linea) => (
        <ItemCarrito
          key={linea.producto.codigo}
          linea={linea}
          onCambiarCantidad={onCambiarCantidad}
          onQuitar={onQuitar}
        />
      ))}
    </div>
  )
}
