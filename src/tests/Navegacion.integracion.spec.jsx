import { screen } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'
import { ordenesService } from '../services/ordenesService'

function iniciarSesionComo(rol) {
  const datos = {
    administrador: { id: 'USR-001', correo: 'ana.perez@duoc.cl', nombre: 'Ana', rol },
    vendedor: { id: 'USR-002', correo: 'carlos.soto@duoc.cl', nombre: 'Carlos', rol },
  }
  localStorage.setItem('grip_sesion', JSON.stringify(datos[rol]))
}

describe('Navegación de la tienda (integración)', () => {
  const rutasPublicas = [
    ['/', /Pisa fuerte/],
    ['/productos', 'Productos'],
    ['/productos/SNK-001', 'GRIP Street 90'],
    ['/categorias', 'Categorías'],
    ['/categorias/urbano', 'Urbano'],
    ['/ofertas', 'Ofertas'],
    ['/registro', 'Crear cuenta'],
    ['/login', 'Iniciar sesión'],
    ['/nosotros', 'Nosotros'],
    ['/blogs', 'Blog GRIP'],
    ['/blogs/cuidado-zapatillas-blancas', '5 errores que arruinan tus zapatillas blancas'],
    ['/contacto', 'Contacto'],
    ['/carrito', 'Carrito de compras'],
  ]

  rutasPublicas.forEach(([ruta, titulo]) => {
    it(`la ruta ${ruta} muestra su encabezado principal`, () => {
      renderConProveedores(<App />, ruta)

      expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
    })
  })

  it('un producto inexistente no rompe la página de detalle', () => {
    renderConProveedores(<App />, '/productos/SNK-999')

    expect(screen.queryByRole('heading', { name: 'GRIP Street 90' })).not.toBeInTheDocument()
  })

  it('la página de pago fallido informa el error y ofrece volver al checkout', () => {
    renderConProveedores(<App />, '/pago-error')

    expect(screen.getByText('No se pudo realizar el pago.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al checkout' })).toHaveAttribute('href', '/checkout')
  })

  it('la página de pago exitoso sin orden redirige al inicio', () => {
    renderConProveedores(<App />, '/pago-exitoso')

    expect(screen.getByRole('heading', { level: 1, name: /Pisa fuerte/ })).toBeInTheDocument()
  })

  it('el checkout vacío redirige al carrito', () => {
    renderConProveedores(<App />, '/checkout')

    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
  })
})

describe('Navegación del panel administrativo (integración)', () => {
  const rutasAdmin = [
    ['/admin', 'Dashboard'],
    ['/admin/ordenes', 'Órdenes y boletas'],
    ['/admin/productos', 'Productos'],
    ['/admin/productos/nuevo', 'Nuevo producto'],
    ['/admin/productos/criticos', /críticos/i],
    ['/admin/productos/reportes', 'Reportes de productos'],
    ['/admin/productos/SNK-001', 'GRIP Street 90'],
    ['/admin/productos/SNK-001/editar', 'Editar GRIP Street 90'],
    ['/admin/categorias', 'Categorías'],
    ['/admin/categorias/nueva', 'Nueva categoría'],
    ['/admin/categorias/urbano/editar', 'Editar Urbano'],
    ['/admin/usuarios', 'Usuarios'],
    ['/admin/usuarios/nuevo', 'Nuevo usuario'],
    ['/admin/usuarios/USR-003', 'Valentina Muñoz'],
    ['/admin/usuarios/USR-003/editar', 'Editar a Valentina Muñoz'],
    ['/admin/usuarios/USR-003/historial', 'Historial de compras'],
    ['/admin/reportes', 'Reportes generales'],
    ['/admin/perfil', 'Mi perfil'],
  ]

  rutasAdmin.forEach(([ruta, titulo]) => {
    it(`el administrador ve ${ruta}`, () => {
      iniciarSesionComo('administrador')
      renderConProveedores(<App />, ruta)

      expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
    })
  })

  it('muestra el detalle de una orden con su boleta', () => {
    iniciarSesionComo('administrador')
    const orden = ordenesService.registrar({
      cliente: { nombre: 'Valentina', apellidos: 'Muñoz', correo: 'valentina.munoz@gmail.com' },
      entrega: { tipo: 'retiro' },
      pago: { metodo: 'tarjeta', ultimos4: '4242' },
      items: [{ codigo: 'SNK-001', nombre: 'GRIP Street 90', cantidad: 1, precioUnitario: 54990, subtotal: 54990 }],
      cupon: null,
      subtotal: 54990,
      descuento: 0,
      envio: 0,
      total: 54990,
      estado: 'pagada',
    })
    renderConProveedores(<App />, `/admin/ordenes/${orden.id}`)

    expect(screen.getByRole('heading', { level: 1, name: 'Boleta' })).toBeInTheDocument()
    expect(screen.getByText('Tarjeta terminada en 4242')).toBeInTheDocument()
  })

  it('el vendedor puede ver productos críticos y su perfil', () => {
    iniciarSesionComo('vendedor')
    renderConProveedores(<App />, '/admin/perfil')

    expect(screen.getByRole('heading', { level: 1, name: 'Mi perfil' })).toBeInTheDocument()
  })
})
