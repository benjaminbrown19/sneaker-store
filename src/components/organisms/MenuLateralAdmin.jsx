import { NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

const ENLACES = [
  { a: '/admin', etiqueta: 'Dashboard', roles: ['administrador', 'vendedor'], exacto: true },
  { a: '/admin/ordenes', etiqueta: 'Órdenes y boletas', roles: ['administrador', 'vendedor'] },
  { a: '/admin/venta', etiqueta: 'Venta en tienda', roles: ['vendedor'] },
  { a: '/admin/productos', etiqueta: 'Productos', roles: ['administrador', 'vendedor'], exacto: true },
  { a: '/admin/productos/criticos', etiqueta: 'Productos críticos', roles: ['administrador', 'vendedor'] },
  { a: '/admin/productos/reportes', etiqueta: 'Reportes de productos', roles: ['administrador'] },
  { a: '/admin/categorias', etiqueta: 'Categorías', roles: ['administrador'] },
  { a: '/admin/usuarios', etiqueta: 'Usuarios', roles: ['administrador'] },
  { a: '/admin/reportes', etiqueta: 'Reportes generales', roles: ['administrador'] },
  { a: '/admin/perfil', etiqueta: 'Mi perfil', roles: ['administrador', 'vendedor'] },
]

export default function MenuLateralAdmin({ rol }) {
  const permitidos = ENLACES.filter((enlace) => enlace.roles.includes(rol))

  return (
    <Nav className="flex-column menu-admin" as="nav" aria-label="Navegación administrativa">
      {permitidos.map((enlace) => (
        <Nav.Link key={enlace.a} as={NavLink} to={enlace.a} end={enlace.exacto}>
          {enlace.etiqueta}
        </Nav.Link>
      ))}
    </Nav>
  )
}
