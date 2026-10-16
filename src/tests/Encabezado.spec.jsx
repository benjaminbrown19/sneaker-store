import { screen, fireEvent } from '@testing-library/react'
import Encabezado from '../components/organisms/Encabezado'
import { renderConRouter } from './utilidades'

describe('Encabezado', () => {
  it('muestra los enlaces de registro e inicio de sesión cuando no hay sesión', () => {
    renderConRouter(<Encabezado cantidadCarrito={0} sesion={null} onCerrarSesion={() => {}} />)

    expect(screen.getByRole('link', { name: 'Registrar usuario' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })

  it('muestra el contador del carrito recibido por props', () => {
    renderConRouter(<Encabezado cantidadCarrito={4} sesion={null} onCerrarSesion={() => {}} />)

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('4')
  })

  it('muestra el acceso al panel solo a administradores y vendedores', () => {
    const { unmount } = renderConRouter(
      <Encabezado cantidadCarrito={0} sesion={{ nombre: 'Carlos', rol: 'vendedor' }} onCerrarSesion={() => {}} />,
    )
    expect(screen.getByRole('link', { name: 'Panel admin' })).toBeInTheDocument()
    expect(screen.getByText('Hola, Carlos')).toBeInTheDocument()
    unmount()

    renderConRouter(
      <Encabezado cantidadCarrito={0} sesion={{ nombre: 'Valentina', rol: 'cliente' }} onCerrarSesion={() => {}} />,
    )
    expect(screen.queryByRole('link', { name: 'Panel admin' })).not.toBeInTheDocument()
  })

  it('llama a onCerrarSesion al presionar el botón', () => {
    const onCerrarSesion = jasmine.createSpy('onCerrarSesion')
    renderConRouter(
      <Encabezado cantidadCarrito={0} sesion={{ nombre: 'Ana', rol: 'administrador' }} onCerrarSesion={onCerrarSesion} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(onCerrarSesion).toHaveBeenCalledTimes(1)
  })
})
