import { render, screen, fireEvent } from '@testing-library/react'
import ItemCarrito from '../components/molecules/ItemCarrito'
import { productoEjemplo } from './utilidades'

const linea = {
  producto: { ...productoEjemplo, stock: 3 },
  cantidad: 2,
  precioUnitario: 54990,
  subtotal: 109980,
}

describe('ItemCarrito', () => {
  it('muestra el producto, la cantidad y el subtotal recibidos', () => {
    render(<ItemCarrito linea={linea} onCambiarCantidad={() => {}} onQuitar={() => {}} />)

    expect(screen.getByRole('heading', { name: 'GRIP Street 90' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('2')
    expect(screen.getByText('$109.980')).toBeInTheDocument()
  })

  it('pide cambiar la cantidad al usar los botones + y −', () => {
    const onCambiarCantidad = jasmine.createSpy('onCambiarCantidad')
    render(<ItemCarrito linea={linea} onCambiarCantidad={onCambiarCantidad} onQuitar={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de GRIP Street 90' }))
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad de GRIP Street 90' }))

    expect(onCambiarCantidad.calls.allArgs()).toEqual([
      ['SNK-001', 3],
      ['SNK-001', 1],
    ])
  })

  it('deshabilita el botón + al llegar al stock y llama a onQuitar con el código', () => {
    const onQuitar = jasmine.createSpy('onQuitar')
    render(<ItemCarrito linea={{ ...linea, cantidad: 3 }} onCambiarCantidad={() => {}} onQuitar={onQuitar} />)

    expect(screen.getByRole('button', { name: 'Aumentar cantidad de GRIP Street 90' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onQuitar).toHaveBeenCalledWith('SNK-001')
  })
})
