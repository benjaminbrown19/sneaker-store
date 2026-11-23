// Cliente HTTP compartido para la API REST de GRIP.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api/v1'

export const EVENTO_SESION_EXPIRADA = 'grip:sesion-expirada'

const TOKEN_KEY = 'grip_access_token'
const REFRESH_KEY = 'grip_refresh_token'

export function guardarTokens(data) {
  sessionStorage.setItem(TOKEN_KEY, data.accessToken)
  sessionStorage.setItem(REFRESH_KEY, data.refreshToken)
}

export function quitarTokens() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function tieneToken() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY))
}

async function mensajeError(respuesta) {
  try {
    const datos = await respuesta.json()
    return datos.detail || datos.message || datos.error || datos.title || null
  } catch {
    return null
  }
}

export async function api(path, options = {}, reintento = true) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('No se pudo conectar con Spring Boot. Verifica que esté encendido en el puerto 8080.')
  }

  if (respuesta.status === 401 && reintento && sessionStorage.getItem(REFRESH_KEY)) {
    const renovacion = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: sessionStorage.getItem(REFRESH_KEY) }),
    }).catch(() => null)

    if (renovacion?.ok) {
      guardarTokens(await renovacion.json())
      return api(path, options, false)
    }

    quitarTokens()
    // Avisa a SesionContext para que cierre la sesión visible (el refresh token venció o fue rechazado).
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
  }

  if (!respuesta.ok) {
    const detalle = await mensajeError(respuesta)
    const mensaje = detalle || (
      respuesta.status === 401 ? 'Debes iniciar sesión o tu sesión expiró.'
        : respuesta.status === 403 ? 'Tu usuario no tiene permisos para esta acción.'
          : respuesta.status === 404 ? 'Registro no encontrado.'
            : respuesta.status === 409 ? 'La operación no se pudo completar por un conflicto de datos o stock.'
              : `Solicitud rechazada por el servidor (HTTP ${respuesta.status}).`
    )
    throw new Error(mensaje)
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}
