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
});

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
    `;
    cuerpo.appendChild(fila);
  });
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
    validar(
      'usuario-fecha-nacimiento',
      datos.fechaNacimiento ? null : 'La fecha de nacimiento es obligatoria.'
    );
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
