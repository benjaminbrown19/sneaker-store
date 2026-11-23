import { authApi } from '../services/authApi'

describe('authApi', () => {
  beforeEach(() => {
    window.fetch.and.callFake(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ accessToken: 'a', refreshToken: 'r', usuario: { rol: 'cliente' } }),
    }))
  })

  it('envía correo y contraseña a POST /auth/login', async () => {
    const datos = await authApi.login('ana.perez@duoc.cl', 'ClaveSegura123')

    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url.endsWith('/auth/login')).toBeTrue()
    expect(opciones.method).toBe('POST')
    expect(JSON.parse(opciones.body)).toEqual({ correo: 'ana.perez@duoc.cl', password: 'ClaveSegura123' })
    expect(datos.accessToken).toBe('a')
  })

  it('envía los datos de la cuenta a POST /auth/registro', async () => {
    await authApi.registro({ correo: 'nuevo@gmail.com', nombre: 'Nuevo', password: 'ClaveSegura123' })

    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url.endsWith('/auth/registro')).toBeTrue()
    expect(opciones.method).toBe('POST')
    expect(JSON.parse(opciones.body).nombre).toBe('Nuevo')
  })
})
