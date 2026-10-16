import { renderHook, act } from '@testing-library/react'
import { SesionProvider, useSesion } from '../context/SesionContext'
import { usuariosService } from '../services/usuariosService'

function envoltorio({ children }) {
  return <SesionProvider>{children}</SesionProvider>
}

describe('SesionContext', () => {
  it('inicia sesión con el rol real del usuario y lo guarda en localStorage', () => {
    spyOn(usuariosService, 'buscarPorCorreo').and.returnValue({
      id: 'USR-001',
      correo: 'ana.perez@duoc.cl',
      nombre: 'Ana',
      tipoUsuario: 'administrador',
    })
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })
    let respuesta

    act(() => {
      respuesta = result.current.iniciarSesion('ana.perez@duoc.cl', '1234')
    })

    expect(respuesta.ok).toBeTrue()
    expect(result.current.sesion.rol).toBe('administrador')
    expect(result.current.esPersonal).toBeTrue()
    expect(JSON.parse(localStorage.getItem('grip_sesion')).nombre).toBe('Ana')
  })

  it('asigna rol cliente a un correo no registrado', () => {
    spyOn(usuariosService, 'buscarPorCorreo').and.returnValue(null)
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    act(() => {
      result.current.iniciarSesion('nuevo@gmail.com', 'abcd')
    })

    expect(result.current.sesion.rol).toBe('cliente')
    expect(result.current.esPersonal).toBeFalse()
  })

  it('devuelve errores y no consulta usuarios si los datos son inválidos', () => {
    const buscar = spyOn(usuariosService, 'buscarPorCorreo')
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })
    let respuesta

    act(() => {
      respuesta = result.current.iniciarSesion('correo-malo', '1')
    })

    expect(respuesta.ok).toBeFalse()
    expect(respuesta.errores.correo).toBeTruthy()
    expect(respuesta.errores.password).toBeTruthy()
    expect(buscar).not.toHaveBeenCalled()
    expect(result.current.estaAutenticado).toBeFalse()
  })

  it('cierra la sesión y borra el dato guardado', () => {
    spyOn(usuariosService, 'buscarPorCorreo').and.returnValue(null)
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    act(() => {
      result.current.iniciarSesion('nuevo@gmail.com', 'abcd')
    })
    act(() => {
      result.current.cerrarSesion()
    })

    expect(result.current.sesion).toBeNull()
    expect(localStorage.getItem('grip_sesion')).toBeNull()
  })
})
