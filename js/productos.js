// ==========================================================================
// GRIP Sneaker Store - js/productos.js
//
// Renderizado dinámico del catálogo de productos. Lee el arreglo `productos`
// (definido en data/productos.js, que debe cargarse ANTES que este archivo
// en el <script> del HTML) y genera las tarjetas con JavaScript, en vez de
// tenerlas escritas a mano como en la Etapa 4.
//
// Se usa en dos lugares:
//   - index.html        -> #lista-destacados (4 productos, uno por categoría)
//   - pages/productos.html -> #lista-productos (catálogo completo + filtros)
// ==========================================================================

// Detecta si estamos dentro de /pages/ para armar las rutas relativas
// correctas hacia las imágenes y hacia la página de detalle, ya que
// index.html y pages/productos.html usan este mismo archivo pero están
// en distinta profundidad de carpetas.
const enSubcarpetaPages = window.location.pathname.includes('/pages/');
const rutaAssetsProductos = enSubcarpetaPages ? '../' : '';
const rutaPaginaDetalle = enSubcarpetaPages ? 'detalle-producto.html' : 'pages/detalle-producto.html';

document.addEventListener('DOMContentLoaded', () => {
  renderizarDestacados();
  renderizarCatalogo();
});

/**
 * Crea el <article class="card-producto"> para un producto, usando
 * exactamente las mismas clases CSS que ya dejamos definidas en la
 * Etapa 3 (css/style.css) y que usamos a mano en la Etapa 4.
 */
function crearTarjetaProducto(producto) {
  const stockBajo =
    typeof producto.stockCritico === 'number' && producto.stock <= producto.stockCritico;

  const articulo = document.createElement('article');
  articulo.className = 'card-producto';
  articulo.dataset.categoria = producto.categoria;

  const textoStock = stockBajo
    ? `¡Solo ${producto.stock} unidades!`
    : `Stock: ${producto.stock} unidades`;

  articulo.innerHTML = `
    <div class="card-producto-media">
      <img src="${rutaAssetsProductos}${producto.imagen}" alt="${producto.nombre}, ${producto.categoria}" class="card-producto-img">
    </div>
    <div class="card-producto-body">
      <p class="card-producto-categoria">${capitalizar(producto.categoria)}</p>
      <h3 class="card-producto-nombre">${producto.nombre}</h3>
      <p class="card-producto-precio">${formatearPrecio(producto.precio)}</p>
      <p class="card-producto-stock${stockBajo ? ' stock-bajo' : ''}">${textoStock}</p>
      <div class="card-producto-footer">
        <a href="${rutaPaginaDetalle}?codigo=${producto.codigo}" class="btn btn-secondary btn-small">Ver detalle</a>
        <button type="button" class="btn btn-primary btn-small">Añadir</button>
      </div>
    </div>
  `;

  return articulo;
}

/**
 * Home: muestra 1 producto de cada categoría (urbano, running, basketball,
 * skate) como "Destacados de la semana".
 */
function renderizarDestacados() {
  const contenedor = document.getElementById('lista-destacados');
  if (!contenedor) return; // esta página no tiene sección de destacados

  const categorias = ['urbano', 'running', 'basketball', 'skate'];
  const destacados = categorias
    .map((categoria) => productos.find((producto) => producto.categoria === categoria))
    .filter(Boolean);

  contenedor.innerHTML = '';
  destacados.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
}

/**
 * Página de catálogo: muestra todos los productos y conecta los filtros
 * de categoría y orden (definidos en el <aside class="filtros"> del HTML).
 */
function renderizarCatalogo() {
  const contenedor = document.getElementById('lista-productos');
  if (!contenedor) return; // esta página no tiene catálogo completo

  const selectCategoria = document.getElementById('filtro-categoria');
  const selectOrden = document.getElementById('filtro-orden');

  const pintarCatalogo = () => {
    let listaFiltrada = [...productos];

    const categoriaElegida = selectCategoria ? selectCategoria.value : 'todas';
    if (categoriaElegida && categoriaElegida !== 'todas') {
      listaFiltrada = listaFiltrada.filter((p) => p.categoria === categoriaElegida);
    }

    const ordenElegido = selectOrden ? selectOrden.value : 'relevancia';
    if (ordenElegido === 'precio-asc') {
      listaFiltrada.sort((a, b) => a.precio - b.precio);
    } else if (ordenElegido === 'precio-desc') {
      listaFiltrada.sort((a, b) => b.precio - a.precio);
    }

    contenedor.innerHTML = '';

    if (listaFiltrada.length === 0) {
      const aviso = document.createElement('p');
      aviso.className = 'mensaje-info';
      aviso.textContent = 'No hay productos en esta categoría por ahora.';
      contenedor.appendChild(aviso);
      return;
    }

    listaFiltrada.forEach((producto) => {
      contenedor.appendChild(crearTarjetaProducto(producto));
    });
  };

  if (selectCategoria) selectCategoria.addEventListener('change', pintarCatalogo);
  if (selectOrden) selectOrden.addEventListener('change', pintarCatalogo);

  pintarCatalogo();
}
