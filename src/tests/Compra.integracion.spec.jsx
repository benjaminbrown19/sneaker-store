import { screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'
import { productosService } from '../services/productosService'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function llegarAlCheckout() {
  fireEvent.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0])
  fireEvent.click(screen.getByRole('link', { name: /Carrito de compras/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }))
}

function completarCheckout(tarjeta) {
  escribir('Nombre', 'Ana')
  escribir('Apellidos', 'Pérez')
  escribir('Correo electrónico', 'ana@duoc.cl')
  fireEvent.click(screen.getByRole('radio', { name: 'Retiro en tienda (gratis)' }))
  escribir('Número de tarjeta', tarjeta)
  fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))
}

describe('Flujo de compra (integración)', () => {
  it('completa la compra, muestra la boleta, vacía el carrito y descuenta el stock', async () => {
    renderConProveedores(<App />, '/productos')
    llegarAlCheckout()
    completarCheckout('4111 1111 1111 1111')

    expect(await screen.findByText('¡Compra realizada con éxito!')).toBeInTheDocument()
    expect(screen.getByText(/Orden ORD-/)).toBeInTheDocument()
    expect(screen.getByText('Retiro en tienda')).toBeInTheDocument()
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')
    expect(productosService.obtener('SNK-001').stock).toBe(17)
  })

  it('muestra la página de pago con error si la tarjeta termina en 0000 y conserva el carrito', async () => {
    renderConProveedores(<App />, '/productos')
    llegarAlCheckout()
    completarCheckout('4111111111110000')

    expect(await screen.findByText(/No se pudo realizar el pago/)).toBeInTheDocument()
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
    expect(productosService.obtener('SNK-001').stock).toBe(18)
  })

  it('aplica un cupón en el carrito y refleja el descuento en el resumen', () => {
    renderConProveedores(<App />, '/productos')
    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0])
    fireEvent.click(screen.getByRole('link', { name: /Carrito de compras/ }))

    fireEvent.change(screen.getByLabelText('¿Tienes un cupón?'), { target: { value: 'grip10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByTestId('resumen-descuento')).toHaveTextContent('-$5.499')
    expect(screen.getByTestId('resumen-total')).toHaveTextContent('$49.491')
  })

  it('redirige al carrito si se entra al checkout sin productos', () => {
    renderConProveedores(<App />, '/checkout')

    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
  })
})
