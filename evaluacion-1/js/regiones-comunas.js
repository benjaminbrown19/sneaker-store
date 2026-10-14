// ==========================================================================
// GRIP Sneaker Store - js/regiones-comunas.js
// Actualización dinámica del select de comuna según la región elegida
// (RF-012). Depende de que data/regiones.js esté cargado ANTES que este
// archivo en el HTML.
//
// Se usa en dos formularios distintos (registro.html y
// admin/usuario-crear.html), por eso está escrito como una función
// reutilizable: inicializarRegionComuna(idSelectRegion, idSelectComuna).
// Si alguno de los dos ids no existe en la página actual, la función
// simplemente no hace nada (evita errores en páginas que no tienen
// ese formulario).
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  inicializarRegionComuna('registro-region', 'registro-comuna');
  inicializarRegionComuna('usuario-region', 'usuario-comuna');
});

function inicializarRegionComuna(idSelectRegion, idSelectComuna) {
  const selectRegion = document.getElementById(idSelectRegion);
  const selectComuna = document.getElementById(idSelectComuna);

  if (!selectRegion || !selectComuna) return; // esta página no tiene este formulario

  selectRegion.addEventListener('change', () => {
    const regionElegida = regiones.find((r) => r.valor === selectRegion.value);

    selectComuna.innerHTML = '';

    if (!regionElegida) {
      selectComuna.disabled = true;
      selectComuna.appendChild(crearOpcion('', 'Primero selecciona una región', true));
      return;
    }

    selectComuna.disabled = false;
    selectComuna.appendChild(crearOpcion('', 'Selecciona tu comuna', true));

    regionElegida.comunas.forEach((nombreComuna) => {
      const valor = nombreComuna.toLowerCase().replace(/\s+/g, '-');
      selectComuna.appendChild(crearOpcion(valor, nombreComuna, false));
    });
  });
}

/**
 * Crea un <option>. Si esPlaceholder es true, queda deshabilitado y
 * seleccionado por defecto (para que el usuario tenga que elegir uno real).
 */
function crearOpcion(valor, textoVisible, esPlaceholder) {
  const opcion = document.createElement('option');
  opcion.value = valor;
  opcion.textContent = textoVisible;
  if (esPlaceholder) {
    opcion.disabled = true;
    opcion.selected = true;
  }
  return opcion;
}
