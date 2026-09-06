// ==========================================================================
// GRIP Sneaker Store - js/admin-ordenes.js
//
// Lista y detalle de las órdenes (compras simuladas), generadas por
// carrito.js cada vez que alguien hace click en "PAGAR". Es la parte del
// panel admin que el rol Vendedor SÍ puede ver, además de productos
// (según el enunciado: "Puede visualizar la lista de órdenes y el detalle").
//
// No depende de data/productos.js: cada orden ya guarda una "foto" del
// nombre y precio de cada producto al momento de la compra, así que no
// hace falta cruzar datos con el catálogo actual.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderizarDashboardOrdenes();
  renderizarTablaOrdenes();
  renderizarDetalleOrden();
});

/**
 * Formatea una fecha ISO guardada como "dd-mm-aaaa, hh:mm".
 */
function formatearFechaOrden(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderizarDashboardOrdenes() {
  const totalEl = document.getElementById('dashboard-total-ordenes');
  if (!totalEl) return;
  totalEl.textContent = leerOrdenesDesdeStorage().length;
}

/**
 * Tabla de pages/admin/ordenes.html: una fila por orden, más reciente
 * primero.
 */
function renderizarTablaOrdenes() {
  const cuerpo = document.getElementById('tabla-ordenes-body');
  if (!cuerpo) return;

  const ordenes = [...leerOrdenesDesdeStorage()].reverse();
  cuerpo.innerHTML = '';

  if (ordenes.length === 0) {
    cuerpo.innerHTML = `
      <tr><td colspan="5" class="placeholder-js">Todavía no hay órdenes registradas. Se crean automáticamente cuando alguien completa una compra desde el carrito.</td></tr>
    `;
    return;
  }

  ordenes.forEach((orden) => {
    const totalUnidades = orden.items.reduce((acumulado, item) => acumulado + item.cantidad, 0);

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td class="dato-numerico">${orden.id}</td>
      <td>${formatearFechaOrden(orden.fecha)}</td>
      <td class="dato-numerico">${totalUnidades}</td>
      <td class="dato-numerico">${formatearPrecio(orden.total)}</td>
      <td><a href="orden-detalle.html?id=${orden.id}" class="boton boton-secundario boton-pequeno">Ver detalle</a></td>
    `;
    cuerpo.appendChild(fila);
  });
}

/**
 * Contenido de pages/admin/orden-detalle.html: lee el id de la URL y
 * muestra los productos de esa orden, más el resumen de subtotal,
 * descuento (si usó cupón) y total.
 */
function renderizarDetalleOrden() {
  const contenedor = document.getElementById('orden-detalle-contenido');
  if (!contenedor) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const orden = leerOrdenesDesdeStorage().find((o) => o.id === id);

  if (!orden) {
    contenedor.innerHTML = '<p class="mensaje-info">No se encontró esa orden.</p>';
    return;
  }

  const filasItems = orden.items
    .map(
      (item) => `
        <tr>
          <td>${item.nombre}</td>
          <td class="dato-numerico">${item.cantidad}</td>
          <td class="dato-numerico">${formatearPrecio(item.precioUnitario)}</td>
          <td class="dato-numerico">${formatearPrecio(item.subtotal)}</td>
        </tr>
      `
    )
    .join('');

  const filaCupon = orden.cupon
    ? `<div class="resumen-fila"><dt>Cupón aplicado</dt><dd>${orden.cupon} (-${formatearPrecio(orden.descuento)})</dd></div>`
    : '';

  contenedor.innerHTML = `
    <p class="admin-referencia">Orden ${orden.id} — ${formatearFechaOrden(orden.fecha)}</p>

    <table class="admin-tabla">
      <caption class="sr-only">Productos de la orden ${orden.id}</caption>
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio unitario</th>
          <th scope="col">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filasItems}</tbody>
    </table>

    <dl class="resumen-lista orden-resumen">
      <div class="resumen-fila">
        <dt>Subtotal</dt>
        <dd>${formatearPrecio(orden.subtotal)}</dd>
      </div>
      ${filaCupon}
      <div class="resumen-fila resumen-total">
        <dt>Total</dt>
        <dd>${formatearPrecio(orden.total)}</dd>
      </div>
    </dl>
  `;
}
