import { screen, fireEvent, within } from '@testing-library/react'
import TablaProductos from '../components/organisms/TablaProductos'
import { renderConRouter, productoEjemplo } from './utilidades'

const productos = [
  productoEjemplo,
  { ...productoEjemplo, codigo: 'SNK-003', nombre: 'GRIP Court Pro', stock: 3, stockCritico: 5 },
]

describe('TablaProductos', () => {
  it('marca como crítico solo el producto con stock menor o igual al crítico', () => {
    renderConRouter(<TablaProductos productos={productos} />)

    const filaNormal = screen.getByText('GRIP Street 90').closest('tr')
    const filaCritica = screen.getByText('GRIP Court Pro').closest('tr')

    expect(within(filaNormal).queryByText('Crítico')).not.toBeInTheDocument()
    expect(within(filaCritica).getByText('Crítico')).toBeInTheDocument()
  })

  it('muestra las acciones de edición solo si el rol puede editar', () => {
    const { unmount } = renderConRouter(<TablaProductos productos={productos} puedeEditar={false} />)
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Ver' }).length).toBe(2)
    unmount()

    renderConRouter(<TablaProductos productos={productos} puedeEditar onEliminar={() => {}} />)
    expect(screen.getAllByRole('button', { name: 'Eliminar' }).length).toBe(2)
  })

  it('llama a onEliminar con el código de la fila elegida', () => {
    const onEliminar = jasmine.createSpy('onEliminar')
    renderConRouter(<TablaProductos productos={productos} puedeEditar onEliminar={onEliminar} />)

    const fila = screen.getByText('GRIP Court Pro').closest('tr')
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))

    expect(onEliminar).toHaveBeenCalledWith('SNK-003')
  })

  it('muestra un mensaje cuando no hay productos', () => {
    renderConRouter(<TablaProductos productos={[]} />)

    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument()
  })
})
