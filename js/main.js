// ==========================================================================
// GRIP Sneaker Store - main.js
// Inicialización común a todas las páginas.
//
// Contiene:
//   1) El toggle del menú móvil (Etapa 3, ligado al CSS responsive).
//   2) Utilidades compartidas de formato (Etapa 5), usadas por productos.js
//      y detalle.js. Van acá porque main.js se carga en TODAS las páginas,
//      así evitamos duplicar estas funciones en cada archivo que las usa.
//   3) El contador del carrito en el header (Etapa 6). También va acá y no
//      en carrito.js, porque el ícono del carrito aparece en TODAS las
//      páginas (incluyendo login, nosotros, blog, admin), no solo en las
//      4 páginas donde carga carrito.js.
//   4) La sesión activa (Etapa 7): quién está logueado y con qué rol, más
//      el cambio del link "Iniciar sesión" por "Cerrar sesión" en el
//      header. Va acá por la misma razón que el contador del carrito: el
//      header aparece en todas las páginas públicas, y roles.js (que
//      también usa obtenerSesionActiva) solo se carga en el panel admin.
// ==========================================================================

const CARRITO_STORAGE_KEY = 'grip_carrito';
const SESION_STORAGE_KEY = 'grip_sesion';

/**
 * Lee el carrito guardado en localStorage. Si no existe o está corrupto,
 * devuelve un arreglo vacío (nunca revienta la página).
 */
function leerCarritoDesdeStorage() {
  try {
    const datos = JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

/**
 * Actualiza el número que se ve en el ícono del carrito del header,
 * sumando las cantidades de todas las líneas del carrito.
 */
function actualizarContadorCarrito() {
  const contador = document.getElementById('contador-carrito');
  if (!contador) return;

  const carrito = leerCarritoDesdeStorage();
  const totalUnidades = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  contador.textContent = totalUnidades;
}

/**
 * Lee la sesión activa (guardada por login.js). Devuelve null si nadie ha
 * iniciado sesión, o si el dato guardado está corrupto.
 */
function obtenerSesionActiva() {
  try {
    return JSON.parse(localStorage.getItem(SESION_STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

/**
 * Si hay una sesión activa, cambia el link "Iniciar sesión" del header por
 * "Cerrar sesión (nombre)", y si el rol es administrador o vendedor,
 * agrega además un acceso directo al panel admin. No hace nada en páginas
 * que no tengan el header público (ej: el panel admin usa su propio topbar).
 */
function actualizarHeaderSesion() {
  const linkLogin = document.getElementById('link-login');
  if (!linkLogin) return;

  const sesion = obtenerSesionActiva();
  if (!sesion) return; // se queda tal cual: "Iniciar sesión"

  linkLogin.textContent = `Cerrar sesión (${sesion.nombre})`;
  linkLogin.removeAttribute('href');
  linkLogin.addEventListener('click', (evento) => {
    evento.preventDefault();
    localStorage.removeItem(SESION_STORAGE_KEY);
    window.location.reload();
  });

  if (sesion.rol === 'administrador' || sesion.rol === 'vendedor') {
    const enSubcarpetaPages = window.location.pathname.includes('/pages/');
    const rutaAdmin = enSubcarpetaPages ? 'admin/dashboard.html' : 'pages/admin/dashboard.html';

    const linkAdmin = document.createElement('a');
    linkAdmin.href = rutaAdmin;
    linkAdmin.className = 'btn-login';
    linkAdmin.textContent = 'Panel admin';
    linkLogin.insertAdjacentElement('beforebegin', linkAdmin);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const abierto = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(abierto));
    });
  }

  actualizarContadorCarrito();
  actualizarHeaderSesion();
});

/**
 * Formatea un número como precio en pesos chilenos (ej: 54990 -> "$54.990").
 */
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });
}

/**
 * Pone en mayúscula la primera letra de un texto (ej: "urbano" -> "Urbano").
 */
function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
