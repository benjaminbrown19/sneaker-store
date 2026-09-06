// ==========================================================================
// GRIP Sneaker Store - js/carrito.js
// Lógica del carrito de compras: agregar, quitar, actualizar cantidades,
// calcular totales, controlar stock y persistir en localStorage
// (RF-003 a RF-009).
//
// Depende de que estén cargados ANTES en el HTML:
//   - js/main.js         -> CARRITO_STORAGE_KEY, leerCarritoDesdeStorage(),
//                            actualizarContadorCarrito()
//   - data/productos.js  -> arreglo `productos`, para saber nombre, precio,
//                            imagen y stock de cada línea del carrito
//
// Se carga en 4 páginas: index.html y pages/productos.html (donde se puede
// agregar desde las tarjetas), pages/detalle-producto.html (se agrega desde
// el formulario de cantidad) y pages/carrito.html (donde además se puede
// ver, editar y vaciar el carrito completo).
//
// REGLAS DE NEGOCIO DEL CARRITO (investigadas y definidas por el equipo,
// según lo pedido en el enunciado):
//   1. Cupones de descuento: un código válido aplica un % de descuento
//      sobre el subtotal. Solo se puede tener 1 cupón activo a la vez.
//   2. Envío gratis: si el subtotal alcanza cierto monto, se avisa al
//      cliente (no se cobra despacho en este proyecto, así que es
//      informativo, pero demuestra la regla de negocio).
// ==========================================================================

const CUPONES_VALIDOS = {
  GRIP10: 0.10, // 10% de descuento
  GRIP20: 0.20, // 20% de descuento (ej. clientes frecuentes)
};

const ENVIO_GRATIS_DESDE = 50000;

let carritoSubtotalActual = 0;
let cuponAplicado = null; // { codigo, porcentaje } | null

document.addEventListener('DOMContentLoaded', () => {
  // Los botones "Añadir" del catálogo/destacados se generan dinámicamente
  // (productos.js), así que en vez de buscarlos uno por uno usamos
  // delegación de eventos: un solo listener en el documento que reacciona
  // a cualquier click sobre un botón con la clase .boton-agregar-carrito,
  // exista ya en el DOM o se haya creado después.
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.boton-agregar-carrito');
    if (!boton) return;

    const resultado = agregarAlCarrito(boton.dataset.codigo, 1);
    mostrarFeedbackBoton(boton, resultado);
  });

  // Botón "PAGAR" (solo existe en pages/carrito.html)
  const botonFinalizar = document.getElementById('btn-finalizar-compra');
  if (botonFinalizar) {
    botonFinalizar.addEventListener('click', () => {
      if (leerCarritoDesdeStorage().length === 0) return;
      localStorage.removeItem(CARRITO_STORAGE_KEY);
      cuponAplicado = null;
      actualizarContadorCarrito();
      renderizarCarrito();
      alert('¡Compra simulada realizada con éxito! Gracias por comprar en GRIP.');
    });
  }

  // Formulario de cupón de descuento (regla de negocio del carrito)
  const formCupon = document.getElementById('form-cupon');
  if (formCupon) {
    formCupon.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const input = document.getElementById('cupon-input');
      const errorCupon = document.getElementById('error-cupon');
      const codigo = input.value.trim().toUpperCase();

      if (!codigo) {
        errorCupon.textContent = 'Ingresa un código de cupón.';
        return;
      }

      const porcentaje = CUPONES_VALIDOS[codigo];
      if (porcentaje === undefined) {
        errorCupon.textContent = 'Ese cupón no es válido.';
        cuponAplicado = null;
        recalcularResumen();
        return;
      }

      cuponAplicado = { codigo, porcentaje };
      errorCupon.textContent = '';
      recalcularResumen();
    });
  }

  renderizarCarrito(); // no hace nada si la página no tiene #carrito-items
});

/**
 * Agrega `cantidad` unidades de un producto al carrito. Si el producto ya
 * estaba en el carrito, suma a la cantidad existente (no duplica la línea).
 * Respeta el stock disponible (RF-007): nunca deja que la cantidad total
 * de una línea supere el stock del producto.
 * @returns {{ok: boolean, mensaje?: string}}
 */
function agregarAlCarrito(codigo, cantidad) {
  const producto = productos.find((p) => p.codigo === codigo);
  if (!producto) {
    return { ok: false, mensaje: 'Producto no encontrado.' };
  }

  const carrito = leerCarritoDesdeStorage();
  const lineaExistente = carrito.find((item) => item.codigo === codigo);
  const cantidadActual = lineaExistente ? lineaExistente.cantidad : 0;
  const cantidadNueva = cantidadActual + cantidad;

  if (cantidadNueva > producto.stock) {
    return {
      ok: false,
      mensaje: `Solo quedan ${producto.stock} unidades de ${producto.nombre}.`,
    };
  }

  if (lineaExistente) {
    lineaExistente.cantidad = cantidadNueva;
  } else {
    carrito.push({ codigo, cantidad });
  }

  guardarCarritoEnStorage(carrito);
  return { ok: true };
}

/**
 * Cambia la cantidad de una línea ya existente en el carrito (usado por
 * los botones +/- y el input numérico de pages/carrito.html). Si la nueva
 * cantidad es menor a 1, elimina la línea directamente.
 */
function actualizarCantidadCarrito(codigo, nuevaCantidad) {
  const producto = productos.find((p) => p.codigo === codigo);
  const carrito = leerCarritoDesdeStorage();
  const linea = carrito.find((item) => item.codigo === codigo);
  if (!linea || !producto) return;

  if (nuevaCantidad < 1) {
    eliminarDelCarrito(codigo);
    return;
  }

  // No permite pedir más unidades de las que hay en stock (RF-007).
  linea.cantidad = Math.min(nuevaCantidad, producto.stock);

  guardarCarritoEnStorage(carrito);
  renderizarCarrito();
}

/**
 * Elimina por completo una línea del carrito (RF-005).
 */
function eliminarDelCarrito(codigo) {
  const carrito = leerCarritoDesdeStorage().filter((item) => item.codigo !== codigo);
  guardarCarritoEnStorage(carrito);
  renderizarCarrito();
}

function guardarCarritoEnStorage(carrito) {
  localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

/**
 * Feedback visual breve en el botón "Añadir": cambia el texto un instante
 * para confirmar la acción, sin necesidad de una alerta que interrumpa
 * la navegación por el catálogo.
 */
function mostrarFeedbackBoton(boton, resultado) {
  const textoOriginal = boton.textContent;
  boton.disabled = true;
  boton.textContent = resultado.ok ? 'Añadido ✓' : 'Sin stock';

  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.disabled = false;
  }, 1200);
}

/**
 * Dibuja el contenido de pages/carrito.html: las líneas del carrito, el
 * resumen de subtotal/total, y el estado de "carrito vacío" (RF-008).
 * En las demás páginas no hace nada porque #carrito-items no existe ahí.
 */
function renderizarCarrito() {
  const contenedor = document.getElementById('carrito-items');
  if (!contenedor) return;

  const avisoVacio = document.getElementById('carrito-vacio');

  // Limpieza defensiva: si algún código guardado ya no existe en el
  // catálogo actual, lo sacamos del carrito en vez de mostrar una línea rota.
  let carrito = leerCarritoDesdeStorage();
  const carritoValido = carrito.filter((item) => productos.some((p) => p.codigo === item.codigo));
  if (carritoValido.length !== carrito.length) {
    guardarCarritoEnStorage(carritoValido);
    carrito = carritoValido;
  }

  if (carrito.length === 0) {
    contenedor.innerHTML = '';
    contenedor.hidden = true;
    if (avisoVacio) avisoVacio.hidden = false;
    actualizarResumenCarrito(0);
    return;
  }

  contenedor.hidden = false;
  if (avisoVacio) avisoVacio.hidden = true;
  contenedor.innerHTML = '';

  let total = 0;

  carrito.forEach((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo);
    const subtotalLinea = producto.precio * item.cantidad;
    total += subtotalLinea;

    const fila = document.createElement('article');
    fila.className = 'carrito-item';
    fila.dataset.codigo = producto.codigo;

    fila.innerHTML = `
      <img src="../${producto.imagen}" alt="${producto.nombre}" class="carrito-item-img">
      <div class="carrito-item-info">
        <h3 class="carrito-item-nombre">${producto.nombre}</h3>
        <p class="carrito-item-precio">${formatearPrecio(producto.precio)} c/u</p>
      </div>
      <div class="carrito-item-cantidad">
        <button type="button" class="carrito-cantidad-boton" data-accion="restar" aria-label="Disminuir cantidad de ${producto.nombre}">−</button>
        <input type="number" class="carrito-cantidad-input" value="${item.cantidad}" min="1" max="${producto.stock}" aria-label="Cantidad de ${producto.nombre}">
        <button type="button" class="carrito-cantidad-boton" data-accion="sumar" aria-label="Aumentar cantidad de ${producto.nombre}">+</button>
      </div>
      <p class="carrito-item-subtotal">${formatearPrecio(subtotalLinea)}</p>
      <button type="button" class="carrito-item-eliminar" aria-label="Eliminar ${producto.nombre} del carrito">Eliminar</button>
    `;

    contenedor.appendChild(fila);
  });

  actualizarResumenCarrito(total);
  conectarControlesDeLineas();
}

/**
 * Guarda el subtotal actual y dispara el cálculo del resumen (llamado
 * cada vez que se renderiza el carrito).
 */
function actualizarResumenCarrito(subtotal) {
  carritoSubtotalActual = subtotal;
  recalcularResumen();
}

/**
 * Calcula el descuento según el cupón activo (si hay uno), el total final,
 * y si el pedido califica para envío gratis. Se llama tanto al renderizar
 * el carrito como al aplicar/quitar un cupón, sin necesidad de recorrer
 * las líneas del carrito de nuevo.
 */
function recalcularResumen() {
  const subtotalEl = document.getElementById('carrito-subtotal');
  const totalEl = document.getElementById('carrito-total');
  const filaDescuento = document.getElementById('fila-descuento');
  const descuentoEl = document.getElementById('carrito-descuento');
  const avisoEnvio = document.getElementById('aviso-envio-gratis');

  const descuento = cuponAplicado ? carritoSubtotalActual * cuponAplicado.porcentaje : 0;
  const total = carritoSubtotalActual - descuento;

  if (subtotalEl) subtotalEl.textContent = formatearPrecio(carritoSubtotalActual);
  if (totalEl) totalEl.textContent = formatearPrecio(total);

  if (filaDescuento && descuentoEl) {
    filaDescuento.hidden = descuento <= 0;
    descuentoEl.textContent = `-${formatearPrecio(descuento)}`;
  }

  if (avisoEnvio) {
    avisoEnvio.hidden = carritoSubtotalActual < ENVIO_GRATIS_DESDE;
  }
}

/**
 * Conecta los botones +/-, el input de cantidad y "Eliminar" de cada fila
 * recién dibujada. Se llama después de cada renderizarCarrito() porque el
 * HTML de las filas se vuelve a generar completo cada vez.
 */
function conectarControlesDeLineas() {
  document.querySelectorAll('.carrito-item').forEach((fila) => {
    const codigo = fila.dataset.codigo;
    const input = fila.querySelector('.carrito-cantidad-input');

    fila.querySelector('[data-accion="restar"]').addEventListener('click', () => {
      actualizarCantidadCarrito(codigo, parseInt(input.value, 10) - 1);
    });

    fila.querySelector('[data-accion="sumar"]').addEventListener('click', () => {
      actualizarCantidadCarrito(codigo, parseInt(input.value, 10) + 1);
    });

    input.addEventListener('change', () => {
      actualizarCantidadCarrito(codigo, parseInt(input.value, 10) || 1);
    });

    fila.querySelector('.carrito-item-eliminar').addEventListener('click', () => {
      eliminarDelCarrito(codigo);
    });
  });
}
