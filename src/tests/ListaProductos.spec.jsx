import { screen } from '@testing-library/react'
import ListaProductos from '../components/organisms/ListaProductos'
import { renderConRouter, productoEjemplo } from './utilidades'

describe('ListaProductos', () => {
  it('renderiza una tarjeta por cada producto del conjunto de datos', () => {
    const productos = [
      productoEjemplo,
      { ...productoEjemplo, codigo: 'SNK-002', nombre: 'GRIP Runner X1' },
      { ...productoEjemplo, codigo: 'SNK-003', nombre: 'GRIP Court Pro' },
    ]

    renderConRouter(<ListaProductos productos={productos} onAgregar={() => {}} />)

    expect(screen.getAllByRole('article').length).toBe(3)
    expect(screen.getByRole('heading', { name: 'GRIP Court Pro' })).toBeInTheDocument()
  })

  it('muestra el mensaje de lista vacía solo cuando no hay productos', () => {
    renderConRouter(<ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Sin resultados." />)

    expect(screen.getByText('Sin resultados.')).toBeInTheDocument()
    expect(screen.queryAllByRole('article').length).toBe(0)
  })
})
