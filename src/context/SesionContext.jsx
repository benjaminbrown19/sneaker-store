import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/authApi'
import { EVENTO_SESION_EXPIRADA, guardarTokens, quitarTokens, tieneToken } from '../services/api'
export const CLAVE_SESION = 'grip_sesion'
const SesionContext = createContext(null)
function sesionGuardada() {
  try { return tieneToken() ? JSON.parse(sessionStorage.getItem(CLAVE_SESION) || 'null') : null }
  catch { return null }
}
export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(sesionGuardada)
  useEffect(() => {
    // Si la renovación del JWT falla, api.js emite este evento: se cierra la sesión visible.
    function cerrarPorExpiracion() {
      sessionStorage.removeItem(CLAVE_SESION)
      setSesion(null)
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, cerrarPorExpiracion)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, cerrarPorExpiracion)
  }, [])
  const iniciarSesion = useCallback(async (correo, password) => {
    try {
      const datos = await authApi.login(correo, password)
      guardarTokens(datos)
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datos.usuario))
      setSesion(datos.usuario)
      return { ok: true, sesion: datos.usuario }
    } catch (error) { return { ok: false, error: error.message } }
  }, [])
  const cerrarSesion = useCallback(() => {
    quitarTokens(); sessionStorage.removeItem(CLAVE_SESION); setSesion(null)
  }, [])
  const actualizarSesion = useCallback((cambios) => {
    setSesion(actual => {
      if (!actual) return null
      const nueva = { ...actual, ...cambios }
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
      return nueva
    })
  }, [])
  const valor = useMemo(() => ({
    sesion, estaAutenticado: Boolean(sesion),
    esPersonal: sesion?.rol === 'administrador' || sesion?.rol === 'vendedor',
    iniciarSesion, cerrarSesion, actualizarSesion,
  }), [sesion, iniciarSesion, cerrarSesion, actualizarSesion])
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
export function useSesion() { const contexto = useContext(SesionContext); if (!contexto) throw new Error('useSesion requiere SesionProvider'); return contexto }
