import { screen, fireEvent, within, waitFor } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'
import { productosService } from '../services/productosService'
import { productosApi } from '../services/productosApi'

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

    const escribir = (etiqueta, valor) =>
      fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

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

  it('solo solicita eliminar un producto cuando el administrador confirma', async () => {
    iniciarSesionComo('administrador', 'Ana', 'ana.perez@duoc.cl')
    const confirmar = spyOn(window, 'confirm').and.returnValues(false, true)
    const eliminarApi = spyOn(productosApi, 'eliminar').and.returnValue(Promise.resolve(null))
    renderConProveedores(<App />, '/admin/productos')

    const textoProducto = await screen.findByText('GRIP Slide Skate')
    const fila = textoProducto.closest('tr')
    const botonEliminar = within(fila).getByRole('button', { name: 'Eliminar' })

    // Si el administrador cancela, la API no debe recibir la solicitud.
    fireEvent.click(botonEliminar)
    expect(confirmar).toHaveBeenCalledTimes(1)
    expect(eliminarApi).not.toHaveBeenCalled()
    expect(screen.getByText('GRIP Slide Skate')).toBeInTheDocument()

    // Si confirma, la pantalla debe enviar el código correcto al servicio REST.
    fireEvent.click(botonEliminar)
    expect(confirmar).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(eliminarApi).toHaveBeenCalledTimes(1)
      expect(eliminarApi).toHaveBeenCalledWith('SNK-004')
    })
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
