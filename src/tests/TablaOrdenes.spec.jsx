import { screen } from '@testing-library/react'
import TablaOrdenes from '../components/organisms/TablaOrdenes'
import { renderConRouter } from './utilidades'

const ordenes = [
  {
    id: 'ORD-1',
    fecha: '2026-11-20T15:00:00Z',
    cliente: { nombre: 'Ana', apellidos: 'Pérez' },
    items: [{ cantidad: 2 }, { cantidad: 1 }],
    total: 109980,
    estado: 'pagada',
  },
  {
    id: 'ORD-2',
    fecha: '2026-11-21T15:00:00Z',
    cliente: { nombre: 'Luis' },
    items: [],
    total: 0,
    estado: 'registrada',
  },
]

describe('TablaOrdenes', () => {
  it('muestra un mensaje cuando no hay órdenes', () => {
    renderConRouter(<TablaOrdenes ordenes={[]} />)

    expect(screen.getByText(/Todavía no hay órdenes/)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renderiza una fila por orden con cliente, unidades y estado', () => {
    renderConRouter(<TablaOrdenes ordenes={ordenes} />)

    expect(screen.getAllByRole('row').length).toBe(3)
    expect(screen.getByText('ORD-1')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Pagada')).toBeInTheDocument()
    expect(screen.getByText('Registrada')).toBeInTheDocument()
  })

  it('enlaza cada orden a su boleta usando la ruta base', () => {
    renderConRouter(<TablaOrdenes ordenes={ordenes} rutaBase="/admin/ordenes" />)

    const enlaces = screen.getAllByRole('link', { name: 'Mostrar boleta' })
    expect(enlaces[0]).toHaveAttribute('href', '/admin/ordenes/ORD-1')
    expect(enlaces[1]).toHaveAttribute('href', '/admin/ordenes/ORD-2')
  })
})
