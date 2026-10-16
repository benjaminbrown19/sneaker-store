import { screen } from '@testing-library/react'
import CarritoDetalle from '../components/organisms/CarritoDetalle'
import { renderConRouter, productoEjemplo } from './utilidades'

describe('CarritoDetalle', () => {
  it('muestra el aviso de carrito vacío con un enlace al catálogo', () => {
    renderConRouter(<CarritoDetalle lineas={[]} onCambiarCantidad={() => {}} onQuitar={() => {}} />)

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/productos')
  })

  it('renderiza una línea por cada producto del carrito', () => {
    const lineas = [
      { producto: productoEjemplo, cantidad: 1, precioUnitario: 54990, subtotal: 54990 },
      { producto: { ...productoEjemplo, codigo: 'SNK-002', nombre: 'GRIP Runner X1' }, cantidad: 2, precioUnitario: 64990, subtotal: 129980 },
    ]

    renderConRouter(<CarritoDetalle lineas={lineas} onCambiarCantidad={() => {}} onQuitar={() => {}} />)

    expect(screen.getAllByRole('article').length).toBe(2)
    expect(screen.queryByText('Tu carrito está vacío.')).not.toBeInTheDocument()
  })
})
