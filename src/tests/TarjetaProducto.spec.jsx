import { screen, fireEvent } from '@testing-library/react'
import TarjetaProducto from '../components/molecules/TarjetaProducto'
import { renderConRouter, productoEjemplo } from './utilidades'

describe('TarjetaProducto', () => {
  it('renderiza el nombre, el código y el precio recibidos por props', () => {
    renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={() => {}} />)

    expect(screen.getByRole('heading', { name: 'GRIP Street 90' })).toBeInTheDocument()
    expect(screen.getByText('SNK-001')).toBeInTheDocument()
    expect(screen.getByTestId('precio-actual')).toHaveTextContent('$54.990')
  })

  it('muestra la insignia y el precio anterior tachado solo cuando hay descuento', () => {
    const { unmount } = renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={() => {}} />)
    expect(screen.queryByTestId('precio-anterior')).not.toBeInTheDocument()
    unmount()

    renderConRouter(<TarjetaProducto producto={{ ...productoEjemplo, descuento: 15 }} onAgregar={() => {}} />)
    expect(screen.getByText('-15%')).toBeInTheDocument()
    expect(screen.getByTestId('precio-anterior').tagName).toBe('DEL')
  })

  it('deshabilita el botón cuando no hay stock', () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoEjemplo, stock: 0 }} onAgregar={() => {}} />)

    const boton = screen.getByRole('button', { name: 'Sin stock' })
    expect(boton).toBeDisabled()
  })

  it('llama a onAgregar con el código del producto al hacer clic', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    renderConRouter(<TarjetaProducto producto={productoEjemplo} onAgregar={onAgregar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))

    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar).toHaveBeenCalledWith('SNK-001')
  })
})
