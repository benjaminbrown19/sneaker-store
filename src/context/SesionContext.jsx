import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { leer, guardar, borrar } from '../services/almacen'
import { usuariosService } from '../services/usuariosService'
import { validarEmail, validarPassword } from '../utils/validaciones'

export const CLAVE_SESION = 'grip_sesion'

const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(() => leer(CLAVE_SESION, null))

  const iniciarSesion = useCallback((correo, password) => {
    const errores = {
      correo: validarEmail(correo),
      password: validarPassword(password),
    }
    if (errores.correo || errores.password) return { ok: false, errores }

    const encontrado = usuariosService.buscarPorCorreo(correo)
    const nueva = encontrado
      ? { id: encontrado.id, correo: encontrado.correo, nombre: encontrado.nombre, rol: encontrado.tipoUsuario }
      : { id: null, correo: correo.trim(), nombre: correo.trim().split('@')[0], rol: 'cliente' }

    guardar(CLAVE_SESION, nueva)
    setSesion(nueva)
    return { ok: true, sesion: nueva }
  }, [])

  const cerrarSesion = useCallback(() => {
    borrar(CLAVE_SESION)
    setSesion(null)
  }, [])

  const actualizarSesion = useCallback((cambios) => {
    setSesion((actual) => {
      if (!actual) return actual
      const nueva = { ...actual, ...cambios }
      guardar(CLAVE_SESION, nueva)
      return nueva
    })
  }, [])

  const valor = useMemo(
    () => ({
      sesion,
      estaAutenticado: Boolean(sesion),
      esPersonal: sesion?.rol === 'administrador' || sesion?.rol === 'vendedor',
      iniciarSesion,
      cerrarSesion,
      actualizarSesion,
    }),
    [sesion, iniciarSesion, cerrarSesion, actualizarSesion],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return contexto
}
