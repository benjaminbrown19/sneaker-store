// ==========================================================================
// GRIP Sneaker Store - js/admin-usuarios.js
// Gestión y creación simulada de usuarios (RF-023, RF-024).
//
// Combina los usuarios "semilla" de data/usuarios.js con los que se
// registraron desde registro.html o se crean aquí mismo, todos guardados
// juntos en localStorage bajo la MISMA clave que usa registro.js
// (grip_usuarios_registrados) — así "usuario registrado" es un solo
// concepto en todo el proyecto, no dos sistemas separados.
//
// Depende de: js/main.js, js/roles.js, js/validaciones.js,
// data/usuarios.js (arreglo `usuarios`), y opcionalmente data/regiones.js
// (si está cargada, se usa solo para mostrar los nombres de región/comuna
// legibles en la tabla en vez de sus códigos internos).
// ==========================================================================

const USUARIOS_REGISTRADOS_KEY = 'grip_usuarios_registrados';

document.addEventListener('DOMContentLoaded', () => {
  renderizarDashboardUsuarios();
  renderizarTablaUsuariosAdmin();
  inicializarFormularioUsuario();
  inicializarEditarUsuario();
  inicializarEliminarUsuario();
});

/**
 * Un solo listener (delegado) para todos los botones "Eliminar" de la
 * tabla, registrado UNA vez. Como la tabla se regenera con cada render,
 * no podemos engancharlo a cada botón directamente sin duplicarlo.
 */
function inicializarEliminarUsuario() {
  const cuerpo = document.getElementById('tabla-usuarios-body');
  if (!cuerpo) return;

  cuerpo.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-eliminar-usuario]');
    if (!boton) return;

    const run = boton.dataset.eliminarUsuario;
    const registrados = obtenerUsuariosRegistrados();
    const existeEnRegistrados = registrados.some((u) => u.run === run);

    if (!existeEnRegistrados) {
      alert('Este es un usuario semilla del sistema y no puede eliminarse en esta versión.');
      return;
    }

    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    const nuevaLista = registrados.filter((u) => u.run !== run);
    localStorage.setItem(USUARIOS_REGISTRADOS_KEY, JSON.stringify(nuevaLista));
    renderizarTablaUsuariosAdmin();
    renderizarDashboardUsuarios();
  });
}

/**
 * Página usuario-editar.html: carga los datos del usuario según el RUN
 * de la URL, los precarga en el formulario, y guarda los cambios. Solo
 * permite editar usuarios que estén en localStorage (registrados desde
 * registro.html o creados desde el admin) — los usuarios "semilla" de
 * data/usuarios.js no se pueden editar en esta versión sin backend.
 */
function inicializarEditarUsuario() {
  const form = document.getElementById('form-usuario-editar');
  if (!form) return;

  const runOriginal = new URLSearchParams(window.location.search).get('run');
  const usuario = obtenerTodosLosUsuarios().find((u) => u.run === runOriginal);
  const referencia = document.getElementById('usuario-editar-referencia');

  if (!usuario) {
    if (referencia) referencia.textContent = 'No se encontró ese usuario.';
    form.hidden = true;
    return;
  }

  const esEditable = obtenerUsuariosRegistrados().some((u) => u.run === runOriginal);
  if (!esEditable) {
    if (referencia) {
      referencia.textContent =
        'Este es un usuario semilla del sistema y no puede editarse en esta versión.';
    }
    form.hidden = true;
    return;
  }

  if (referencia) {
    referencia.textContent = `Editando: ${usuario.nombre} ${usuario.apellidos} (${usuario.run})`;
  }

  document.getElementById('usuario-run-original').value = usuario.run;
  document.getElementById('usuario-run').value = usuario.run;
  document.getElementById('usuario-nombre').value = usuario.nombre;
  document.getElementById('usuario-apellidos').value = usuario.apellidos;
  document.getElementById('usuario-correo').value = usuario.correo;
  document.getElementById('usuario-fecha-nacimiento').value = usuario.fechaNacimiento || '';
  document.getElementById('usuario-tipo').value = usuario.tipoUsuario;
  document.getElementById('usuario-direccion').value = usuario.direccion;

  // Selecciona la región y dispara "change" para que regiones-comunas.js
  // llene el select de comuna, y recién ahí seleccionamos la comuna guardada.
  const selectRegion = document.getElementById('usuario-region');
  if (selectRegion && usuario.region) {
    selectRegion.value = usuario.region;
    selectRegion.dispatchEvent(new Event('change'));
    const selectComuna = document.getElementById('usuario-comuna');
    if (selectComuna && usuario.comuna) selectComuna.value = usuario.comuna;
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = {
      run: usuario.run, // el RUN no se edita, es de solo lectura
      nombre: document.getElementById('usuario-nombre').value.trim(),
      apellidos: document.getElementById('usuario-apellidos').value.trim(),
      correo: document.getElementById('usuario-correo').value.trim(),
      fechaNacimiento: document.getElementById('usuario-fecha-nacimiento').value,
      tipoUsuario: document.getElementById('usuario-tipo').value,
      region: document.getElementById('usuario-region').value,
      comuna: document.getElementById('usuario-comuna').value,
      direccion: document.getElementById('usuario-direccion').value.trim(),
    };

    let esValido = true;
    const validar = (idInput, mensajeError) => {
      if (mensajeError) {
        mostrarError(idInput, mensajeError);
        esValido = false;
      } else {
        limpiarError(idInput);
      }
    };

    validar('usuario-nombre', validarTexto(datos.nombre, { max: 50, nombreCampo: 'El nombre' }));
    validar('usuario-apellidos', validarTexto(datos.apellidos, { max: 100, nombreCampo: 'Los apellidos' }));
    validar('usuario-correo', validarEmail(datos.correo));
    validar('usuario-tipo', datos.tipoUsuario ? null : 'Selecciona un tipo de usuario.');
    validar('usuario-region', datos.region ? null : 'Selecciona una región.');
    validar('usuario-comuna', datos.comuna ? null : 'Selecciona una comuna.');
    validar('usuario-direccion', validarTexto(datos.direccion, { max: 300, nombreCampo: 'La dirección' }));

    const mensajeExito = document.getElementById('exito-usuario');
    if (!esValido) {
      mensajeExito.textContent = '';
      return;
    }

    const registrados = obtenerUsuariosRegistrados();
    const indice = registrados.findIndex((u) => u.run === usuario.run);
    registrados[indice] = { ...registrados[indice], ...datos };
    localStorage.setItem(USUARIOS_REGISTRADOS_KEY, JSON.stringify(registrados));

    mensajeExito.textContent = 'Cambios guardados correctamente.';
  });
}

function obtenerUsuariosRegistrados() {
  try {
    const datos = JSON.parse(localStorage.getItem(USUARIOS_REGISTRADOS_KEY));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function obtenerTodosLosUsuarios() {
  return [...usuarios, ...obtenerUsuariosRegistrados()];
}

function renderizarDashboardUsuarios() {
  const totalEl = document.getElementById('dashboard-total-usuarios');
  if (!totalEl) return;
  totalEl.textContent = obtenerTodosLosUsuarios().length;
}

function renderizarTablaUsuariosAdmin() {
  const cuerpo = document.getElementById('tabla-usuarios-body');
  if (!cuerpo) return;

  cuerpo.innerHTML = '';

  obtenerTodosLosUsuarios().forEach((usuario) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td class="dato-numerico">${usuario.run}</td>
      <td>${usuario.nombre} ${usuario.apellidos}</td>
      <td>${usuario.correo}</td>
      <td>${capitalizar(usuario.tipoUsuario)}</td>
      <td>${formatearNombreRegionComuna(usuario.region, false)}</td>
      <td>${formatearNombreRegionComuna(usuario.comuna, true)}</td>
      <td>
        <div class="admin-tabla-acciones">
          <a href="usuario-editar.html?run=${usuario.run}" class="boton boton-secundario boton-pequeno" data-rol-permitido="administrador">Editar</a>
          <button type="button" class="boton boton-peligro boton-pequeno" data-eliminar-usuario="${usuario.run}" data-rol-permitido="administrador">Eliminar</button>
        </div>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  // Los links "Editar" y botones "Eliminar" recién creados no existían
  // cuando roles.js aplicó los permisos por primera vez, así que los
  // volvemos a aplicar ahora que ya están en el DOM.
  if (typeof aplicarPermisosVisuales === 'function' && rolActivo) {
    aplicarPermisosVisuales(rolActivo);
  }
}

/**
 * Región/comuna se guardan como "slug" (ej: "valparaiso"), así que para
 * mostrarlas legibles buscamos el nombre real en data/regiones.js. Si esa
 * página no cargó regiones.js, o no se encuentra, se muestra el valor
 * guardado tal cual (mejor eso que romper la tabla).
 */
function formatearNombreRegionComuna(valorGuardado, esComuna) {
  if (!valorGuardado) return '—';
  if (typeof regiones === 'undefined') return valorGuardado;

  if (!esComuna) {
    const region = regiones.find((r) => r.valor === valorGuardado);
    return region ? region.nombre : valorGuardado;
  }

  for (const region of regiones) {
    const comunaEncontrada = region.comunas.find(
      (c) => c.toLowerCase().replace(/\s+/g, '-') === valorGuardado
    );
    if (comunaEncontrada) return comunaEncontrada;
  }
  return valorGuardado;
}

function inicializarFormularioUsuario() {
  const form = document.getElementById('form-usuario');

  if (document.getElementById('usuario-run')) {
    activarValidacionEnVivo({
      'usuario-run': validarRUN,
      'usuario-nombre': (v) => validarTexto(v, { max: 50, nombreCampo: 'El nombre' }),
      'usuario-apellidos': (v) => validarTexto(v, { max: 100, nombreCampo: 'Los apellidos' }),
      'usuario-correo': validarEmail,
      'usuario-direccion': (v) => validarTexto(v, { max: 300, nombreCampo: 'La dirección' }),
    });
  }

  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = {
      run: document.getElementById('usuario-run').value.trim().toUpperCase(),
      nombre: document.getElementById('usuario-nombre').value.trim(),
      apellidos: document.getElementById('usuario-apellidos').value.trim(),
      correo: document.getElementById('usuario-correo').value.trim(),
      fechaNacimiento: document.getElementById('usuario-fecha-nacimiento').value,
      tipoUsuario: document.getElementById('usuario-tipo').value,
      region: document.getElementById('usuario-region').value,
      comuna: document.getElementById('usuario-comuna').value,
      direccion: document.getElementById('usuario-direccion').value.trim(),
    };

    let esValido = true;
    const validar = (idInput, mensajeError) => {
      if (mensajeError) {
        mostrarError(idInput, mensajeError);
        esValido = false;
      } else {
        limpiarError(idInput);
      }
    };

    validar('usuario-run', validarRUN(datos.run));

    if (esValido) {
      const yaExiste = obtenerTodosLosUsuarios().some((u) => u.run === datos.run);
      if (yaExiste) {
        mostrarError('usuario-run', 'Ya existe un usuario con ese RUN.');
        esValido = false;
      }
    }

    validar('usuario-nombre', validarTexto(datos.nombre, { max: 50, nombreCampo: 'El nombre' }));
    validar('usuario-apellidos', validarTexto(datos.apellidos, { max: 100, nombreCampo: 'Los apellidos' }));
    validar('usuario-correo', validarEmail(datos.correo));
    validar('usuario-fecha-nacimiento', null); // opcional, según el enunciado
    validar('usuario-tipo', datos.tipoUsuario ? null : 'Selecciona un tipo de usuario.');
    validar('usuario-region', datos.region ? null : 'Selecciona una región.');
    validar('usuario-comuna', datos.comuna ? null : 'Selecciona una comuna.');
    validar('usuario-direccion', validarTexto(datos.direccion, { max: 300, nombreCampo: 'La dirección' }));

    const mensajeExito = document.getElementById('exito-usuario');

    if (!esValido) {
      mensajeExito.textContent = '';
      return;
    }

    const usuariosGuardados = obtenerUsuariosRegistrados();
    usuariosGuardados.push(datos);
    localStorage.setItem(USUARIOS_REGISTRADOS_KEY, JSON.stringify(usuariosGuardados));

    mensajeExito.textContent = 'Usuario creado correctamente.';
    form.reset();
    document.getElementById('usuario-comuna').disabled = true;
  });
}
