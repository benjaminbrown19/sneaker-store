import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SesionProvider } from '../context/SesionContext'
import { CarritoProvider } from '../context/CarritoContext'

export function renderConRouter(ui, ruta = '/') {
  return render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>)
}

export function renderConProveedores(ui, ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>{ui}</CarritoProvider>
      </SesionProvider>
    </MemoryRouter>,
  )
}

export const productoEjemplo = {
  codigo: 'SNK-001',
  nombre: 'GRIP Street 90',
  descripcion: 'Zapatilla urbana de caña baja.',
  precio: 54990,
  stock: 18,
  stockCritico: 5,
  categoria: 'urbano',
  descuento: 0,
  imagen: '/assets/img/producto-snk-001.jpg',
}
