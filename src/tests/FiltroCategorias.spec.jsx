import { render, screen, fireEvent } from '@testing-library/react'
import FiltroCategorias from '../components/molecules/FiltroCategorias'

const categorias = [
  { id: 'urbano', nombre: 'Urbano' },
  { id: 'skate', nombre: 'Skate' },
]

describe('FiltroCategorias', () => {
  it('renderiza "Todas" más una opción por categoría y marca la seleccionada', () => {
    render(<FiltroCategorias categorias={categorias} seleccionada="skate" onSeleccionar={() => {}} />)

    expect(screen.getAllByRole('button').length).toBe(3)
    expect(screen.getByRole('button', { name: 'Skate' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('informa la categoría elegida mediante onSeleccionar', () => {
    const onSeleccionar = jasmine.createSpy('onSeleccionar')
    render(<FiltroCategorias categorias={categorias} seleccionada="" onSeleccionar={onSeleccionar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Urbano' }))
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }))

    expect(onSeleccionar.calls.allArgs()).toEqual([['urbano'], ['']])
  })
})
