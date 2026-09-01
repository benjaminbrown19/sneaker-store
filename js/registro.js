// ==========================================================================
// GRIP Sneaker Store - js/registro.js
// Validación y registro de nuevos usuarios (RF-010, RF-011, RF-012).
//
// Valida los 10 campos del formulario usando las funciones de
// validaciones.js (que debe cargarse ANTES que este archivo). Si todo es
// válido, guarda el usuario en localStorage (simulando una base de datos,
// ya que no existe backend) y muestra el mensaje de éxito.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campos = {
      run: document.getElementById('registro-run').value,
      nombre: document.getElementById('registro-nombre').value,
      apellidos: document.getElementById('registro-apellidos').value,
      correo: document.getElementById('registro-correo').value,
      fechaNacimiento: document.getElementById('registro-fecha-nacimiento').value,
      region: document.getElementById('registro-region').value,
      comuna: document.getElementById('registro-comuna').value,
      direccion: document.getElementById('registro-direccion').value,
      password: document.getElementById('registro-password').value,
      passwordConfirmar: document.getElementById('registro-password-confirmar').value,
    };

    let esValido = true;

    // Pequeño helper local: aplica el mensaje de error (o lo limpia) y
    // actualiza la bandera esValido, para no repetir el mismo if/else
    // 10 veces seguidas.
    const validarCampo = (idInput, mensajeError) => {
      if (mensajeError) {
        mostrarError(idInput, mensajeError);
        esValido = false;
      } else {
        limpiarError(idInput);
      }
    };

    validarCampo('registro-run', validarRUN(campos.run));
    validarCampo('registro-nombre', validarTexto(campos.nombre, { max: 50, nombreCampo: 'El nombre' }));
    validarCampo('registro-apellidos', validarTexto(campos.apellidos, { max: 100, nombreCampo: 'Los apellidos' }));
    validarCampo('registro-correo', validarEmail(campos.correo));
    validarCampo(
      'registro-fecha-nacimiento',
      campos.fechaNacimiento ? null : 'La fecha de nacimiento es obligatoria.'
    );
    validarCampo('registro-region', campos.region ? null : 'Selecciona una región.');
    validarCampo('registro-comuna', campos.comuna ? null : 'Selecciona una comuna.');
    validarCampo('registro-direccion', validarTexto(campos.direccion, { max: 300, nombreCampo: 'La dirección' }));
    validarCampo('registro-password', validarPassword(campos.password));

    let errorConfirmar = null;
    if (!campos.passwordConfirmar) {
      errorConfirmar = 'Debes confirmar tu contraseña.';
    } else if (campos.passwordConfirmar !== campos.password) {
      errorConfirmar = 'Las contraseñas no coinciden.';
    }
    validarCampo('registro-password-confirmar', errorConfirmar);

    const mensajeExito = document.getElementById('exito-registro');

    if (!esValido) {
      mensajeExito.textContent = '';
      return;
    }

    const nuevoUsuario = {
      run: campos.run.trim().toUpperCase(),
      nombre: campos.nombre.trim(),
      apellidos: campos.apellidos.trim(),
      correo: campos.correo.trim(),
      fechaNacimiento: campos.fechaNacimiento,
      tipoUsuario: 'cliente',
      region: campos.region,
      comuna: campos.comuna,
      direccion: campos.direccion.trim(),
    };

    const usuariosGuardados = JSON.parse(localStorage.getItem('grip_usuarios_registrados') || '[]');
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('grip_usuarios_registrados', JSON.stringify(usuariosGuardados));

    mensajeExito.textContent = 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
    form.reset();
    document.getElementById('registro-comuna').disabled = true;
  });
});
