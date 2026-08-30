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
// ==========================================================================

const CARRITO_STORAGE_KEY = 'grip_carrito';

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
