import { screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'

describe('App (integración)', () => {
  it('muestra el catálogo completo y filtra al escribir en el buscador', () => {
    renderConProveedores(<App />, '/productos')
    expect(screen.getAllByRole('article').length).toBe(8)

    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'runner' } })

    expect(screen.getAllByRole('article').length).toBe(1)
    expect(screen.getByRole('heading', { name: 'GRIP Runner X1' })).toBeInTheDocument()
  })

  it('actualiza el contador del encabezado y avisa al añadir un producto', () => {
    renderConProveedores(<App />, '/productos')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')

    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0])

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
    expect(screen.getByText('Producto añadido al carrito.')).toBeInTheDocument()
  })

  it('redirige al login si se intenta entrar al panel sin sesión', () => {
    renderConProveedores(<App />, '/admin')

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('muestra la página 404 para rutas inexistentes', () => {
    renderConProveedores(<App />, '/ruta-que-no-existe')

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})
