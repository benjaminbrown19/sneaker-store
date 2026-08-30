// ==========================================================================
// GRIP Sneaker Store - js/detalle.js
//
// Renderiza el detalle de UN producto en pages/detalle-producto.html, leyendo
// el código del producto desde el parámetro de la URL (ej:
// detalle-producto.html?codigo=SNK-002) y buscándolo en el arreglo
// `productos` (data/productos.js, cargado antes que este archivo).
//
// Reemplaza el contenido que en la Etapa 4 estaba "quemado" a mano
// (siempre mostraba SNK-001) por el producto que el usuario clickeó
// realmente desde el catálogo.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('detalle-contenido');
  if (!contenedor) return;

  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get('codigo');
  const producto = productos.find((p) => p.codigo === codigo);

  if (!producto) {
    // Quitamos la clase de grid de 2 columnas porque el mensaje de
    // "no encontrado" es de una sola columna, no un layout imagen+info.
    contenedor.classList.remove('detalle-grid');
    contenedor.innerHTML = `
      <p class="mensaje-info">
        No encontramos ese producto. <a href="productos.html">Volver al catálogo</a>
      </p>
    `;
    return;
  }

  document.title = `${producto.nombre} — GRIP Sneaker Store`;

  const breadcrumb = document.getElementById('breadcrumb-producto');
  if (breadcrumb) breadcrumb.textContent = producto.nombre;

  contenedor.innerHTML = `
    <div class="detalle-imagen">
      <img src="../${producto.imagen}" alt="${producto.nombre}, ${producto.categoria}">
    </div>
    <div class="detalle-info">
      <p class="card-producto-categoria">${capitalizar(producto.categoria)}</p>
      <h1 id="detalle-nombre">${producto.nombre}</h1>
      <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
      <p class="card-producto-stock">Stock disponible: ${producto.stock} unidades</p>
      <p class="detalle-descripcion">${producto.descripcion}</p>
    </div>
  `;

  // El campo de cantidad no puede pedir más unidades de las que hay en stock.
  const inputCantidad = document.getElementById('cantidad');
  if (inputCantidad) {
    inputCantidad.max = producto.stock;
  }

  // Validamos la cantidad al enviar el formulario. El botón todavía no
  // agrega nada a un carrito real: eso se conecta en la Etapa 6, cuando
  // exista carrito.js + localStorage. Por ahora dejamos la validación de
  // stock lista y funcionando (RF-007).
  const formAgregar = document.getElementById('form-agregar-carrito');
  if (formAgregar) {
    formAgregar.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const cantidad = parseInt(inputCantidad.value, 10);
      const mensajeStock = document.getElementById('mensaje-stock');

      if (!cantidad || cantidad < 1) {
        mensajeStock.textContent = 'Ingresa una cantidad válida.';
        return;
      }
      if (cantidad > producto.stock) {
        mensajeStock.textContent = `Solo quedan ${producto.stock} unidades disponibles.`;
        return;
      }

      mensajeStock.textContent = '';
      // TODO Etapa 6: guardar { codigo, cantidad } en el carrito (localStorage).
    });
  }
});
