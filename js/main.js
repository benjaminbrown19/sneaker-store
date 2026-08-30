// ==========================================================================
// GRIP Sneaker Store - main.js
// Inicialización común a todas las páginas.
//
// Contiene:
//   1) El toggle del menú móvil (Etapa 3, ligado al CSS responsive).
//   2) Utilidades compartidas de formato (Etapa 5), usadas por productos.js
//      y detalle.js. Van acá porque main.js se carga en TODAS las páginas,
//      así evitamos duplicar estas funciones en cada archivo que las usa.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const abierto = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(abierto));
    });
  }
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
