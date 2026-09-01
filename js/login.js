// ==========================================================================
// GRIP Sneaker Store - js/login.js
// Validación y simulación de inicio de sesión.
//
// Como este proyecto es 100% frontend (sin backend real), no existe una
// base de datos que confirme si el correo/contraseña son correctos. Lo que
// SÍ podemos y debemos validar con JavaScript es el FORMATO de ambos campos
// (RF-014, IE1.2.1). Si el formato es válido, simulamos un login exitoso
// guardando una "sesión" en localStorage, que roles.js podrá leer más
// adelante (Etapa 7) para saber que hay alguien logueado.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('login-correo').value;
    const password = document.getElementById('login-password').value;
    const mensajeExito = document.getElementById('exito-login');

    let esValido = true;

    const errorCorreo = validarEmail(correo);
    if (errorCorreo) {
      mostrarError('login-correo', errorCorreo);
      esValido = false;
    } else {
      limpiarError('login-correo');
    }

    const errorPassword = validarPassword(password);
    if (errorPassword) {
      mostrarError('login-password', errorPassword);
      esValido = false;
    } else {
      limpiarError('login-password');
    }

    if (!esValido) {
      mensajeExito.textContent = '';
      return;
    }

    const sesion = { correo: correo.trim(), rol: 'cliente' };
    localStorage.setItem('grip_sesion', JSON.stringify(sesion));

    mensajeExito.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
    form.reset();

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  });
});
