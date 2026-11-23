import { api } from './api'
export const authApi = {
  login: (correo, password) => api('/auth/login', { method:'POST', body: JSON.stringify({ correo, password }) }),
  registro: (datos) => api('/auth/registro', { method:'POST', body: JSON.stringify(datos) }),
}
