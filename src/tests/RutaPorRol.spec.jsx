import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SesionProvider, CLAVE_SESION } from '../context/SesionContext'
import RutaPorRol from '../components/templates/RutaPorRol'

function iniciarSesionComo(rol) {
  sessionStorage.setItem('grip_access_token', 'token')
  sessionStorage.setItem('grip_refresh_token', 'refresco')
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 1, correo: 'u@duoc.cl', nombre: 'U', rol }))
}

function renderizar(roles) {
  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <SesionProvider>
        <Routes>
          <Route path="/protegida" element={<RutaPorRol roles={roles}><p>Contenido protegido</p></RutaPorRol>} />
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/" element={<p>Tienda</p>} />
          <Route path="/admin/productos" element={<p>Productos admin</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

describe('RutaPorRol (restricción de acceso en el frontend)', () => {
  it('redirige al login cuando no hay sesión', () => {
    renderizar(['administrador'])

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('muestra el contenido cuando el rol está permitido', () => {
    iniciarSesionComo('administrador')
    renderizar(['administrador'])

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('envía al vendedor al listado de productos si la ruta es solo de administrador', () => {
    iniciarSesionComo('vendedor')
    renderizar(['administrador'])

    expect(screen.getByText('Productos admin')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('envía al cliente a la tienda si intenta entrar a una ruta restringida', () => {
    iniciarSesionComo('cliente')
    renderizar(['administrador', 'vendedor'])

    expect(screen.getByText('Tienda')).toBeInTheDocument()
  })
})
