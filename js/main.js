// ==========================================================================
// GRIP Sneaker Store - main.js
// Inicialización común a todas las páginas.
//
// Por ahora (Etapa 3) solo contiene el toggle del menú móvil, porque está
// directamente ligado al CSS responsive que acabamos de construir y sin él
// la navegación quedaría inutilizable en pantallas angostas.
//
// El resto de esta responsabilidad (resaltar el link activo, sincronizar
// el contador del carrito en el header con localStorage, etc.) se agrega
// en la Etapa 5 / Etapa 6.
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
