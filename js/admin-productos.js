// ==========================================================================
// GRIP Sneaker Store - js/admin-productos.js
// CRUD simulado de productos: listar, crear, editar (RF-020, RF-021) y
// alerta de stock crítico (RF-022).
//
// IMPORTANTE: como este proyecto no tiene backend, los productos que se
// crean o editan aquí NO modifican el catálogo público real
// (data/productos.js). Se guardan en una copia aparte en localStorage
// (grip_productos_admin), sembrada la primera vez desde data/productos.js.
// Así el panel admin puede demostrar el CRUD completo sin arriesgar
// romper el catálogo/carrito que ya vimos funcionando en las Etapas 5 y 6.
//
// Depende de: js/main.js, js/roles.js, js/validaciones.js,
// data/productos.js (arreglo `productos`, usado solo como semilla).
// ==========================================================================

const PRODUCTOS_ADMIN_KEY = 'grip_productos_admin';

document.addEventListener('DOMContentLoaded', () => {
  renderizarDashboardProductos();
  renderizarTablaProductosAdmin();
  inicializarFormularioProducto();
});

function obtenerCatalogoAdmin() {
  const guardado = localStorage.getItem(PRODUCTOS_ADMIN_KEY);
  if (guardado) {
    try {
      const datos = JSON.parse(guardado);
      if (Array.isArray(datos)) return datos;
    } catch (error) {
      // sigue abajo y reinicia desde data/productos.js
    }
  }
  const copiaInicial = JSON.parse(JSON.stringify(productos));
  guardarCatalogoAdmin(copiaInicial);
  return copiaInicial;
}

function guardarCatalogoAdmin(catalogo) {
  localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(catalogo));
}

function renderizarDashboardProductos() {
  const totalEl = document.getElementById('dashboard-total-productos');
  const criticoEl = document.getElementById('dashboard-stock-critico');
  if (!totalEl && !criticoEl) return;

  const catalogo = obtenerCatalogoAdmin();
  if (totalEl) totalEl.textContent = catalogo.length;
  if (criticoEl) {
    const critico = catalogo.filter(
      (p) => typeof p.stockCritico === 'number' && p.stock <= p.stockCritico
    );
    criticoEl.textContent = critico.length;
  }
}

function renderizarTablaProductosAdmin() {
  const cuerpo = document.getElementById('tabla-productos-body');
  if (!cuerpo) return;

  const catalogo = obtenerCatalogoAdmin();
  cuerpo.innerHTML = '';

  catalogo.forEach((producto) => {
    const stockBajo = typeof producto.stockCritico === 'number' && producto.stock <= producto.stockCritico;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td class="dato-numerico">${producto.codigo}</td>
      <td><img src="../../${producto.imagen}" alt="${producto.nombre}" class="admin-tabla-img"></td>
      <td>${producto.nombre}</td>
      <td>${capitalizar(producto.categoria)}</td>
      <td class="dato-numerico">${formatearPrecio(producto.precio)}</td>
      <td class="dato-numerico">${producto.stock}</td>
      <td>
        <span class="badge-stock ${stockBajo ? 'badge-critico' : 'badge-ok'}">${stockBajo ? 'Stock crítico' : 'OK'}</span>
      </td>
      <td>
        <a href="producto-editar.html?codigo=${producto.codigo}" class="boton boton-secundario boton-pequeno" data-rol-permitido="administrador">Editar</a>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  // Los links "Editar" recién creados no existían cuando roles.js aplicó
  // los permisos por primera vez (esta tabla se generó después), así que
  // los volvemos a aplicar ahora que ya están en el DOM.
  if (typeof aplicarPermisosVisuales === 'function' && rolActivo) {
    aplicarPermisosVisuales(rolActivo);
  }
}

function inicializarFormularioProducto() {
  const formCrear = document.getElementById('form-producto');
  const formEditar = document.getElementById('form-producto-editar');

  if (formCrear) inicializarCrearProducto(formCrear);
  if (formEditar) inicializarEditarProducto(formEditar);
}

function inicializarCrearProducto(form) {
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = leerCamposProducto();
    if (!validarCamposProducto(datos, null)) return;

    const catalogo = obtenerCatalogoAdmin();
    catalogo.push(datos);
    guardarCatalogoAdmin(catalogo);

    document.getElementById('exito-producto').textContent = 'Producto creado correctamente.';
    form.reset();
  });
}

function inicializarEditarProducto(form) {
  const parametros = new URLSearchParams(window.location.search);
  const codigoOriginal = parametros.get('codigo');
  const catalogo = obtenerCatalogoAdmin();
  const producto = catalogo.find((p) => p.codigo === codigoOriginal);

  const referencia = document.getElementById('producto-editar-referencia');

  if (!producto) {
    if (referencia) referencia.textContent = 'No se encontró ese producto.';
    form.hidden = true;
    return;
  }

  if (referencia) referencia.textContent = `Editando: ${producto.nombre} (${producto.codigo})`;

  document.getElementById('producto-codigo-original').value = producto.codigo;
  document.getElementById('producto-codigo').value = producto.codigo;
  document.getElementById('producto-nombre').value = producto.nombre;
  document.getElementById('producto-descripcion').value = producto.descripcion || '';
  document.getElementById('producto-precio').value = producto.precio;
  document.getElementById('producto-stock').value = producto.stock;
  document.getElementById('producto-stock-critico').value =
    typeof producto.stockCritico === 'number' ? producto.stockCritico : '';
  document.getElementById('producto-categoria').value = producto.categoria;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = leerCamposProducto();
    if (!validarCamposProducto(datos, codigoOriginal)) return;

    const catalogoActual = obtenerCatalogoAdmin();
    const indice = catalogoActual.findIndex((p) => p.codigo === codigoOriginal);
    catalogoActual[indice] = { ...catalogoActual[indice], ...datos };
    guardarCatalogoAdmin(catalogoActual);

    document.getElementById('exito-producto').textContent = 'Cambios guardados correctamente.';
  });
}

function leerCamposProducto() {
  const stockCriticoValor = document.getElementById('producto-stock-critico').value;

  return {
    codigo: document.getElementById('producto-codigo').value.trim(),
    nombre: document.getElementById('producto-nombre').value.trim(),
    descripcion: document.getElementById('producto-descripcion').value.trim(),
    precio: parseFloat(document.getElementById('producto-precio').value),
    stock: parseInt(document.getElementById('producto-stock').value, 10),
    stockCritico: stockCriticoValor ? parseInt(stockCriticoValor, 10) : undefined,
    categoria: document.getElementById('producto-categoria').value,
    // Sin backend no se puede procesar una imagen subida de verdad;
    // todo producto nuevo/editado usa este placeholder de marca.
    imagen: 'assets/img/producto-generico.svg',
  };
}

function validarCamposProducto(datos, codigoASustituir) {
  let esValido = true;

  const validar = (idInput, mensajeError) => {
    if (mensajeError) {
      mostrarError(idInput, mensajeError);
      esValido = false;
    } else {
      limpiarError(idInput);
    }
  };

  validar('producto-codigo', validarTexto(datos.codigo, { min: 3, nombreCampo: 'El código' }));

  if (esValido) {
    const yaExiste = obtenerCatalogoAdmin().some(
      (p) => p.codigo === datos.codigo && p.codigo !== codigoASustituir
    );
    if (yaExiste) {
      mostrarError('producto-codigo', 'Ya existe un producto con ese código.');
      esValido = false;
    }
  }

  validar('producto-nombre', validarTexto(datos.nombre, { max: 100, nombreCampo: 'El nombre' }));
  validar(
    'producto-descripcion',
    validarTexto(datos.descripcion, { obligatorio: false, max: 500, nombreCampo: 'La descripción' })
  );

  if (isNaN(datos.precio) || datos.precio < 0) {
    mostrarError('producto-precio', 'El precio debe ser un número mayor o igual a 0.');
    esValido = false;
  } else {
    limpiarError('producto-precio');
  }

  if (isNaN(datos.stock) || datos.stock < 0 || !Number.isInteger(datos.stock)) {
    mostrarError('producto-stock', 'El stock debe ser un número entero mayor o igual a 0.');
    esValido = false;
  } else {
    limpiarError('producto-stock');
  }

  if (
    datos.stockCritico !== undefined &&
    (datos.stockCritico < 0 || !Number.isInteger(datos.stockCritico))
  ) {
    mostrarError('producto-stock-critico', 'El stock crítico debe ser un número entero mayor o igual a 0.');
    esValido = false;
  } else {
    limpiarError('producto-stock-critico');
  }

  validar('producto-categoria', datos.categoria ? null : 'Selecciona una categoría.');

  return esValido;
}
