// ==========================================================================
// GRIP Sneaker Store - js/roles.js
// Simulación de roles y permisos administrativos (RF-018, RF-019).
//
// Como el proyecto no tiene backend, esto NO es seguridad real: cualquiera
// que sepa JavaScript podría editar el localStorage y saltarse esto. Es
// una simulación de la EXPERIENCIA de tener roles, tal como lo pide el
// enunciado (documentado también como restricción en la ERS).
//
// Depende de js/main.js (ya cargado antes), que define obtenerSesionActiva().
//
// Se carga en las 6 páginas de pages/admin/. Hace 3 cosas al entrar a
// cualquiera de ellas:
//   1. Si no hay sesión, o el rol es "cliente", redirige a login.html
//      (un cliente no debería ni ver el panel admin).
//   2. Si la página actual tiene un data-pagina-permitida en el <body>
//      que no incluye el rol actual, redirige a productos.html (ej: un
//      Vendedor no puede entrar directo a usuario-crear.html escribiendo
//      la URL a mano).
//   3. Oculta cualquier elemento marcado con data-rol-permitido="..." si
//      el rol actual no está en esa lista (los ítems del menú lateral,
//      los botones "+ Crear...", etc, ya vienen marcados así desde la
//      Etapa 2).
// ==========================================================================

let rolActivo = null;

document.addEventListener('DOMContentLoaded', () => {
  const sesion = obtenerSesionActiva();

  if (!sesion || sesion.rol === 'cliente') {
    window.location.href = '../login.html';
    return;
  }

  rolActivo = sesion.rol;

  aplicarPermisosDePagina(rolActivo);
  aplicarPermisosVisuales(rolActivo);
  mostrarUsuarioActivo(sesion);
});

/**
 * Si la página completa está restringida a ciertos roles (vía
 * data-pagina-permitida en el <body>) y el rol actual no está permitido,
 * redirige a un lugar que sí pueda ver (el listado de productos).
 */
function aplicarPermisosDePagina(rol) {
  const permitidosTexto = document.body.dataset.paginaPermitida;
  if (!permitidosTexto) return; // esta página no restringe por rol

  const permitidos = permitidosTexto.split(',').map((r) => r.trim());
  if (!permitidos.includes(rol)) {
    window.location.href = 'productos.html';
  }
}

/**
 * Oculta cualquier elemento con data-rol-permitido que no incluya el rol
 * actual. Se exporta como función global (no solo dentro del listener)
 * porque admin-productos.js y admin-usuarios.js la vuelven a llamar
 * después de generar filas de tabla dinámicamente, ya que esos elementos
 * no existían todavía cuando roles.js corrió por primera vez.
 */
function aplicarPermisosVisuales(rol) {
  document.querySelectorAll('[data-rol-permitido]').forEach((elemento) => {
    const permitidos = elemento.dataset.rolPermitido.split(',').map((r) => r.trim());
    elemento.style.display = permitidos.includes(rol) ? '' : 'none';
  });
}

/**
 * Muestra "Nombre · Rol" en el topbar del panel admin.
 */
function mostrarUsuarioActivo(sesion) {
  const contenedor = document.getElementById('admin-usuario-activo');
  if (contenedor) {
    contenedor.textContent = `${sesion.nombre} · ${capitalizar(rolActivo)}`;
  }
}
