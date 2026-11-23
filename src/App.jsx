
import { Navigate, Route, Routes } from 'react-router-dom'

import PlantillaTienda from './components/templates/PlantillaTienda'
import PlantillaAdmin from './components/templates/PlantillaAdmin'
import RutaPorRol from './components/templates/RutaPorRol'

import Inicio from './pages/tienda/Inicio'
import Productos from './pages/tienda/Productos'
import DetalleProducto from './pages/tienda/DetalleProducto'
import Registro from './pages/tienda/Registro'
import Login from './pages/tienda/Login'
import Nosotros from './pages/tienda/Nosotros'
import Blogs from './pages/tienda/Blogs'
import DetalleBlog from './pages/tienda/DetalleBlog'
import Contacto from './pages/tienda/Contacto'
import Categorias from './pages/tienda/Categorias'
import DetalleCategoria from './pages/tienda/DetalleCategoria'
import Ofertas from './pages/tienda/Ofertas'
import Carrito from './pages/tienda/Carrito'
import Checkout from './pages/tienda/Checkout'
import PagoExitoso from './pages/tienda/PagoExitoso'
import PagoError from './pages/tienda/PagoError'
import NoEncontrada from './pages/tienda/NoEncontrada'

import Dashboard from './pages/admin/Dashboard'
import Ordenes from './pages/admin/Ordenes'
import DetalleOrden from './pages/admin/DetalleOrden'
import ProductosAdmin from './pages/admin/Productos'
import ProductoNuevo from './pages/admin/ProductoNuevo'
import ProductoDetalle from './pages/admin/ProductoDetalle'
import ProductoEditar from './pages/admin/ProductoEditar'
import ProductosCriticos from './pages/admin/ProductosCriticos'
import ReportesProductos from './pages/admin/ReportesProductos'
import CategoriasAdmin from './pages/admin/Categorias'
import CategoriaNueva from './pages/admin/CategoriaNueva'
import CategoriaEditar from './pages/admin/CategoriaEditar'
import Usuarios from './pages/admin/Usuarios'
import UsuarioNuevo from './pages/admin/UsuarioNuevo'
import UsuarioDetalle from './pages/admin/UsuarioDetalle'
import UsuarioEditar from './pages/admin/UsuarioEditar'
import HistorialCompras from './pages/admin/HistorialCompras'
import ReportesGenerales from './pages/admin/ReportesGenerales'
import Perfil from './pages/admin/Perfil'
import VentaTienda from './pages/admin/VentaTienda'

// Acceso exclusivo para administrador
function soloAdmin(elemento) {
  return (
    <RutaPorRol roles={['administrador']}>
      {elemento}
    </RutaPorRol>
  )
}

// Acceso para administrador y vendedor
function adminYVendedor(elemento) {
  return (
    <RutaPorRol roles={['administrador', 'vendedor']}>
      {elemento}
    </RutaPorRol>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Páginas públicas de la tienda */}
      <Route element={<PlantillaTienda />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:codigo" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<DetalleCategoria />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="registro" element={<Registro />} />
        <Route path="login" element={<Login />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago-exitoso" element={<PagoExitoso />} />
        <Route path="pago-error" element={<PagoError />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* Panel administrativo y de vendedor */}
      <Route path="admin" element={<PlantillaAdmin />}>

        {/* Solo administrador */}
        <Route index element={soloAdmin(<Dashboard />)} />

        {/* Administrador y vendedor */}
        <Route path="ordenes" element={adminYVendedor(<Ordenes />)} />
        <Route path="ordenes/:id" element={adminYVendedor(<DetalleOrden />)} />
        <Route path="venta" element={soloAdmin(<VentaTienda />)} />
        <Route path="productos" element={adminYVendedor(<ProductosAdmin />)} />
        <Route path="productos/:codigo" element={adminYVendedor(<ProductoDetalle />)} />
        <Route path="perfil" element={adminYVendedor(<Perfil />)} />

        {/* Solo administrador */}
        <Route path="productos/nuevo" element={soloAdmin(<ProductoNuevo />)} />
        <Route path="productos/criticos" element={soloAdmin(<ProductosCriticos />)} />
        <Route path="productos/reportes" element={soloAdmin(<ReportesProductos />)} />
        <Route path="productos/:codigo/editar" element={soloAdmin(<ProductoEditar />)} />

        <Route path="categorias" element={soloAdmin(<CategoriasAdmin />)} />
        <Route path="categorias/nueva" element={soloAdmin(<CategoriaNueva />)} />
        <Route path="categorias/:id/editar" element={soloAdmin(<CategoriaEditar />)} />

        <Route path="usuarios" element={soloAdmin(<Usuarios />)} />
        <Route path="usuarios/nuevo" element={soloAdmin(<UsuarioNuevo />)} />
        <Route path="usuarios/:id" element={soloAdmin(<UsuarioDetalle />)} />
        <Route path="usuarios/:id/editar" element={soloAdmin(<UsuarioEditar />)} />
        <Route path="usuarios/:id/historial" element={soloAdmin(<HistorialCompras />)} />

        <Route path="reportes" element={soloAdmin(<ReportesGenerales />)} />

      </Route>
    </Routes>
  )
}
