import { api, guardarTokens, quitarTokens, tieneToken } from '../services/api'

function respuesta(datos, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => datos,
  }
}

describe('api (cliente HTTP con JWT)', () => {
  it('guarda, detecta y elimina los tokens en sessionStorage', () => {
    expect(tieneToken()).toBeFalse()

    guardarTokens({ accessToken: 'acceso', refreshToken: 'refresco' })
    expect(tieneToken()).toBeTrue()
    expect(sessionStorage.getItem('grip_access_token')).toBe('acceso')
    expect(sessionStorage.getItem('grip_refresh_token')).toBe('refresco')

    quitarTokens()
    expect(tieneToken()).toBeFalse()
  })

  it('envía el token Bearer cuando existe una sesión', async () => {
    guardarTokens({ accessToken: 'acceso', refreshToken: 'refresco' })
    window.fetch.and.callFake(async () => respuesta({ ok: true }))

    await api('/productos')

    const opciones = window.fetch.calls.mostRecent().args[1]
    expect(opciones.headers.Authorization).toBe('Bearer acceso')
    expect(opciones.headers['Content-Type']).toBe('application/json')
  })

  it('no envía Authorization si no hay sesión', async () => {
    window.fetch.and.callFake(async () => respuesta([]))

    await api('/productos')

    const opciones = window.fetch.calls.mostRecent().args[1]
    expect(opciones.headers.Authorization).toBeUndefined()
  })

  it('renueva el token al recibir 401 y repite la solicitud original una sola vez', async () => {
    guardarTokens({ accessToken: 'vencido', refreshToken: 'refresco' })
    window.fetch.and.callFake(async (url, opciones) => {
      if (url.endsWith('/auth/refresh')) {
        expect(JSON.parse(opciones.body)).toEqual({ refreshToken: 'refresco' })
        return respuesta({ accessToken: 'nuevo', refreshToken: 'refresco-nuevo' })
      }
      return opciones.headers.Authorization === 'Bearer nuevo'
        ? respuesta({ dato: 'protegido' })
        : respuesta({ message: 'Autenticacion requerida' }, 401)
    })

    const datos = await api('/ordenes')

    expect(datos).toEqual({ dato: 'protegido' })
    expect(sessionStorage.getItem('grip_access_token')).toBe('nuevo')
    expect(sessionStorage.getItem('grip_refresh_token')).toBe('refresco-nuevo')
    expect(window.fetch.calls.count()).toBe(3)
  })

  it('elimina los tokens y falla si la renovación es rechazada', async () => {
    guardarTokens({ accessToken: 'vencido', refreshToken: 'vencido' })
    window.fetch.and.callFake(async (url) =>
      url.endsWith('/auth/refresh')
        ? respuesta({ message: 'Token invalido o expirado' }, 401)
        : respuesta({}, 401),
    )

    await expectAsync(api('/ordenes')).toBeRejectedWithError('Debes iniciar sesión o tu sesión expiró.')
    expect(tieneToken()).toBeFalse()
  })

  it('traduce los códigos HTTP a mensajes claros cuando el servidor no entrega detalle', async () => {
    const casos = [
      [403, 'Tu usuario no tiene permisos para esta acción.'],
      [404, 'Registro no encontrado.'],
      [409, 'La operación no se pudo completar por un conflicto de datos o stock.'],
      [500, 'Solicitud rechazada por el servidor (HTTP 500).'],
    ]

    for (const [estado, mensaje] of casos) {
      window.fetch.and.callFake(async () => ({ ok: false, status: estado, json: async () => { throw new Error('sin cuerpo') } }))
      await expectAsync(api('/productos/X')).toBeRejectedWithError(mensaje)
    }
  })

  it('prioriza el mensaje que entrega el servidor', async () => {
    window.fetch.and.callFake(async () => respuesta({ message: 'Stock insuficiente para: GRIP Street 90' }, 409))

    await expectAsync(api('/ordenes/checkout', { method: 'POST' })).toBeRejectedWithError(
      'Stock insuficiente para: GRIP Street 90',
    )
  })

  it('informa cuando no se puede conectar con Spring Boot', async () => {
    window.fetch.and.callFake(async () => { throw new TypeError('Failed to fetch') })

    await expectAsync(api('/productos')).toBeRejectedWithError(/No se pudo conectar con Spring Boot/)
  })

  it('devuelve null en respuestas 204 (eliminación)', async () => {
    window.fetch.and.callFake(async () => respuesta(null, 204))

    expect(await api('/productos/SNK-001', { method: 'DELETE' })).toBeNull()
  })
})

describe('api: sesión expirada', () => {
  it('emite un evento global cuando la renovación del token falla', async () => {
    guardarTokens({ accessToken: 'vencido', refreshToken: 'vencido' })
    const alExpirar = jasmine.createSpy('alExpirar')
    window.addEventListener('grip:sesion-expirada', alExpirar)
    window.fetch.and.callFake(async () => ({ ok: false, status: 401, json: async () => ({}) }))

    await expectAsync(api('/ordenes')).toBeRejected()

    window.removeEventListener('grip:sesion-expirada', alExpirar)
    expect(alExpirar).toHaveBeenCalledTimes(1)
  })
})
