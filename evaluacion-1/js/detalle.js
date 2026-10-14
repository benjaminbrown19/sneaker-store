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
      <img src="../${producto.imagen}" alt="${producto.nombre}, ${producto.categoria}" id="detalle-imagen-principal">
      <!-- Galería de miniaturas: por ahora las 3 apuntan a la misma foto,
           porque todavía solo tenemos 1 imagen por producto. Cuando se
           agreguen fotos de otros ángulos, basta con cambiar el src de
           cada miniatura — el click ya está conectado y funcionando. -->
      <div class="detalle-galeria" role="group" aria-label="Miniaturas del producto">
        <button type="button" class="detalle-thumb activo"><img src="../${producto.imagen}" alt="Vista 1 de ${producto.nombre}"></button>
        <button type="button" class="detalle-thumb"><img src="../${producto.imagen}" alt="Vista 2 de ${producto.nombre}"></button>
        <button type="button" class="detalle-thumb"><img src="../${producto.imagen}" alt="Vista 3 de ${producto.nombre}"></button>
      </div>
    </div>
    <div class="detalle-info">
      <p class="card-producto-categoria">${capitalizar(producto.categoria)}</p>
      <h1 id="detalle-nombre">${producto.nombre}</h1>
      <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
      <p class="card-producto-stock">Stock disponible: ${producto.stock} unidades</p>
      <p class="detalle-descripcion">${producto.descripcion}</p>
    </div>
  `;

  conectarGaleria();
  renderizarRelacionados(producto);

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
        mensajeStock.className = 'mensaje-error';
        mensajeStock.textContent = 'Ingresa una cantidad válida.';
        return;
      }
      if (cantidad > producto.stock) {
        mensajeStock.className = 'mensaje-error';
        mensajeStock.textContent = `Solo quedan ${producto.stock} unidades disponibles.`;
        return;
      }

      const resultado = agregarAlCarrito(producto.codigo, cantidad);
      if (!resultado.ok) {
        mensajeStock.className = 'mensaje-error';
        mensajeStock.textContent = resultado.mensaje;
        return;
      }

      mensajeStock.className = 'mensaje-exito';
      mensajeStock.textContent = 'Producto añadido al carrito.';
    });
  }
});

/**
 * Conecta los clicks de las miniaturas: al hacer click, la imagen
 * principal cambia por la de la miniatura seleccionada, y se marca esa
 * miniatura como "activa" visualmente.
 */
function conectarGaleria() {
  const imagenPrincipal = document.getElementById('detalle-imagen-principal');
  const miniaturas = document.querySelectorAll('.detalle-thumb');
  if (!imagenPrincipal || miniaturas.length === 0) return;

  miniaturas.forEach((miniatura) => {
    miniatura.addEventListener('click', () => {
      const imgMiniatura = miniatura.querySelector('img');
      imagenPrincipal.src = imgMiniatura.src;
      miniaturas.forEach((m) => m.classList.remove('activo'));
      miniatura.classList.add('activo');
    });
  });
}

/**
 * Muestra hasta 4 productos de la misma categoría (sin incluir el actual)
 * en la sección "Productos relacionados". Reutiliza crearTarjetaProducto()
 * de js/productos.js (por eso esa página también carga ese archivo).
 */
function renderizarRelacionados(productoActual) {
  const contenedor = document.getElementById('lista-relacionados');
  if (!contenedor) return;

  const relacionados = productos
    .filter((p) => p.categoria === productoActual.categoria && p.codigo !== productoActual.codigo)
    .slice(0, 4);

  contenedor.innerHTML = '';

  if (relacionados.length === 0) {
    contenedor.innerHTML = '<p class="mensaje-info">No hay más productos en esta categoría por ahora.</p>';
    return;
  }

  relacionados.forEach((p) => contenedor.appendChild(crearTarjetaProducto(p)));
}
