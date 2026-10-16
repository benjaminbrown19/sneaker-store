import { Navigate } from 'react-router-dom'
import { useSesion } from '../../context/SesionContext'

export default function RutaPorRol({ roles, children }) {
  const { sesion } = useSesion()

  if (!sesion) return <Navigate to="/login" replace />
  if (!roles.includes(sesion.rol)) return <Navigate to="/admin/productos" replace />

  return children
}
