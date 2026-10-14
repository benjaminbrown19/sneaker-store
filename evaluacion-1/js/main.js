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
const ORDENES_STORAGE_KEY = 'grip_ordenes';

/**
 * Lee las órdenes (compras simuladas) guardadas en localStorage. Cada
 * orden se crea en carrito.js cuando alguien hace click en "PAGAR", y
 * la lee el panel admin (js/admin-ordenes.js) para el rol Vendedor.
 */
function leerOrdenesDesdeStorage() {
  try {
    const datos = JSON.parse(localStorage.getItem(ORDENES_STORAGE_KEY));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

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
  if (!sesion) return; // se queda tal cual: "Iniciar sesión" + "Registrar usuario"

  const linkRegistro = document.getElementById('link-registro');
  if (linkRegistro) linkRegistro.hidden = true;

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
  inicializarNewsletter();
});

/**
 * Formulario de newsletter del footer (presente en las 11 páginas
 * públicas). Es una validación simple y autocontenida en main.js —no usa
 * validarEmail() de validaciones.js porque esa librería no se carga en
 * TODAS las páginas (ej. blogs.html), y este formulario sí está en todas.
 */
function inicializarNewsletter() {
  const form = document.getElementById('form-newsletter');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const input = document.getElementById('newsletter-email');
    const mensaje = document.getElementById('exito-newsletter');
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

    if (!formatoValido) {
      mensaje.textContent = 'Ingresa un correo válido.';
      return;
    }

    mensaje.textContent = '¡Gracias por suscribirte! Te avisaremos de nuevos lanzamientos.';
    form.reset();
  });
}

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

/**
 * Dibuja botones de paginación (1, 2, 3...) dentro del contenedor indicado.
 * Si solo hay 1 página, no dibuja nada (no tiene sentido paginar una sola
 * página). La reutilizan admin-productos.js y admin-usuarios.js.
 *
 * @param {string} contenedorId  id del <div> donde van los botones
 * @param {number} totalPaginas
 * @param {number} paginaActual
 * @param {(pagina:number) => void} alCambiarPagina  qué hacer al hacer click
 */
function crearControlesPaginacion(contenedorId, totalPaginas, paginaActual, alCambiarPagina) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = '';
  if (totalPaginas <= 1) return;

  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = String(pagina);
    boton.className = 'admin-paginacion-boton' + (pagina === paginaActual ? ' activo' : '');
    boton.addEventListener('click', () => alCambiarPagina(pagina));
    contenedor.appendChild(boton);
  }
}
