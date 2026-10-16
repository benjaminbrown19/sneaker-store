import { screen, fireEvent, within } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'
import { productosService } from '../services/productosService'

function iniciarSesionComo(rol, nombre, correo) {
  localStorage.setItem('grip_sesion', JSON.stringify({ id: 'USR-X', correo, nombre, rol }))
}

describe('Panel administrativo (integración)', () => {
  it('el administrador ve el dashboard y el menú completo', () => {
    iniciarSesionComo('administrador', 'Ana', 'ana.perez@duoc.cl')
    renderConProveedores(<App />, '/admin')

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    const menu = screen.getByRole('navigation', { name: 'Navegación administrativa' })
    expect(within(menu).getByRole('link', { name: 'Usuarios' })).toBeInTheDocument()
    expect(within(menu).getByRole('link', { name: 'Categorías' })).toBeInTheDocument()
  })

  it('el vendedor tiene un menú reducido y es redirigido al intentar entrar a usuarios', () => {
    iniciarSesionComo('vendedor', 'Carlos', 'carlos.soto@duoc.cl')
    renderConProveedores(<App />, '/admin/usuarios')

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
    const menu = screen.getByRole('navigation', { name: 'Navegación administrativa' })
    expect(within(menu).queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Nuevo producto' })).not.toBeInTheDocument()
  })

  it('un cliente no puede entrar al panel', () => {
    iniciarSesionComo('cliente', 'Valentina', 'valentina.munoz@gmail.com')
    renderConProveedores(<App />, '/admin')

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('crea un producto desde el formulario y aparece en el listado', async () => {
    iniciarSesionComo('administrador', 'Ana', 'ana.perez@duoc.cl')
    renderConProveedores(<App />, '/admin/productos/nuevo')

    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
    escribir('Código', 'SNK-077')
    escribir('Nombre', 'GRIP Integración')
    escribir('Precio (CLP)', '45000')
    escribir('Stock', '4')
    escribir('Stock crítico', '5')
    escribir('Categoría', 'urbano')
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(await screen.findByText('GRIP Integración')).toBeInTheDocument()
    expect(productosService.obtener('SNK-077').stock).toBe(4)
    expect(screen.getAllByText('Crítico').length).toBeGreaterThan(1)
  })

  it('elimina un producto solo si el administrador confirma', async () => {
    iniciarSesionComo('administrador', 'Ana', 'ana.perez@duoc.cl')
    const confirmar = spyOn(window, 'confirm').and.returnValues(false, true)
    renderConProveedores(<App />, '/admin/productos')

    const fila = screen.getByText('GRIP Skate'.replace('Skate', 'Slide Skate')).closest('tr')
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    expect(productosService.obtener('SNK-004')).not.toBeNull()

    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    expect(confirmar).toHaveBeenCalledTimes(2)
    expect(productosService.obtener('SNK-004')).toBeNull()
  })

  it('no deja eliminar una categoría que tiene productos asociados', () => {
    iniciarSesionComo('administrador', 'Ana', 'ana.perez@duoc.cl')
    const alerta = spyOn(window, 'alert')
    renderConProveedores(<App />, '/admin/categorias')

    const fila = screen.getByText('Urbano').closest('tr')
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))

    expect(alerta).toHaveBeenCalledWith(jasmine.stringContaining('productos asociados'))
  })
})
