import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SesionProvider } from '../context/SesionContext'
import { CarritoProvider } from '../context/CarritoContext'

export function renderConRouter(ui, ruta = '/') {
  return render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>)
}

function prepararSesionDePrueba() {
  // Los tests históricos guardan la sesión simulada en localStorage.
  // La aplicación integrada usa sessionStorage y exige un access token.
  const sesionAnterior = localStorage.getItem('grip_sesion')
  if (sesionAnterior && !sessionStorage.getItem('grip_sesion')) {
    sessionStorage.setItem('grip_sesion', sesionAnterior)
    sessionStorage.setItem('grip_access_token', 'token-de-prueba-no-firmado')
    sessionStorage.setItem('grip_refresh_token', 'refresh-de-prueba-no-firmado')
  }
}

export function renderConProveedores(ui, ruta = '/') {
  prepararSesionDePrueba()
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
