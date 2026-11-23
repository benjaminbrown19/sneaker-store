import { renderHook, act } from '@testing-library/react'
import { SesionProvider, useSesion, CLAVE_SESION } from '../context/SesionContext'
import { authApi } from '../services/authApi'

function envoltorio({ children }) {
  return <SesionProvider>{children}</SesionProvider>
}

function respuestaLogin(rol = 'administrador') {
  const usuario = {
    id: rol === 'vendedor' ? 'USR-002' : 'USR-001',
    correo: rol === 'vendedor' ? 'carlos.soto@duoc.cl' : 'ana.perez@duoc.cl',
    nombre: rol === 'vendedor' ? 'Carlos' : 'Ana',
    rol,
  }
  return {
    accessToken: 'access-token-prueba',
    refreshToken: 'refresh-token-prueba',
    usuario,
  }
}

describe('SesionContext integrado con JWT', () => {
  it('inicia sesión con el usuario y rol devueltos por la API y guarda tokens en sessionStorage', async () => {
    spyOn(authApi, 'login').and.returnValue(Promise.resolve(respuestaLogin('administrador')))
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })
    let respuesta

    await act(async () => {
      respuesta = await result.current.iniciarSesion('ana.perez@duoc.cl', 'ClaveSegura123')
    })

    expect(respuesta.ok).toBeTrue()
    expect(result.current.sesion.rol).toBe('administrador')
    expect(result.current.esPersonal).toBeTrue()
    expect(JSON.parse(sessionStorage.getItem(CLAVE_SESION)).nombre).toBe('Ana')
    expect(sessionStorage.getItem('grip_access_token')).toBe('access-token-prueba')
    expect(sessionStorage.getItem('grip_refresh_token')).toBe('refresh-token-prueba')
  })

  it('respeta el rol cliente devuelto por el backend', async () => {
    spyOn(authApi, 'login').and.returnValue(Promise.resolve(respuestaLogin('cliente')))
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    await act(async () => {
      await result.current.iniciarSesion('cliente@gmail.com', 'ClaveSegura123')
    })

    expect(result.current.sesion.rol).toBe('cliente')
    expect(result.current.esPersonal).toBeFalse()
  })

  it('devuelve el error de autenticación del backend sin crear una sesión', async () => {
    spyOn(authApi, 'login').and.returnValue(Promise.reject(new Error('Credenciales incorrectas.')))
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })
    let respuesta

    await act(async () => {
      respuesta = await result.current.iniciarSesion('ana.perez@duoc.cl', 'incorrecta')
    })

    expect(respuesta.ok).toBeFalse()
    expect(respuesta.error).toBe('Credenciales incorrectas.')
    expect(result.current.sesion).toBeNull()
    expect(result.current.estaAutenticado).toBeFalse()
  })

  it('cierra la sesión y elimina usuario y tokens', async () => {
    spyOn(authApi, 'login').and.returnValue(Promise.resolve(respuestaLogin('vendedor')))
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    await act(async () => {
      await result.current.iniciarSesion('carlos.soto@duoc.cl', 'ClaveSegura123')
    })
    act(() => result.current.cerrarSesion())

    expect(result.current.sesion).toBeNull()
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull()
    expect(sessionStorage.getItem('grip_access_token')).toBeNull()
    expect(sessionStorage.getItem('grip_refresh_token')).toBeNull()
  })
  it('cierra la sesión visible cuando api.js informa que el token expiró', async () => {
    spyOn(authApi, 'login').and.returnValue(Promise.resolve(respuestaLogin('administrador')))
    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    await act(async () => {
      await result.current.iniciarSesion('ana.perez@duoc.cl', 'ClaveSegura123')
    })
    expect(result.current.estaAutenticado).toBeTrue()

    act(() => {
      window.dispatchEvent(new Event('grip:sesion-expirada'))
    })

    expect(result.current.sesion).toBeNull()
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('recupera la sesión guardada al recargar la página si aún hay token', () => {
    sessionStorage.setItem('grip_access_token', 'token')
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 1, correo: 'ana.perez@duoc.cl', nombre: 'Ana', rol: 'administrador' }))

    const { result } = renderHook(() => useSesion(), { wrapper: envoltorio })

    expect(result.current.sesion.nombre).toBe('Ana')
    expect(result.current.esPersonal).toBeTrue()
  })
})
