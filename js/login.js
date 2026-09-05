// ==========================================================================
// GRIP Sneaker Store - js/login.js
// Validación y simulación de inicio de sesión.
//
// Como este proyecto es 100% frontend (sin backend real), no existe una
// base de datos que confirme si el correo/contraseña son correctos. Lo que
// SÍ podemos y debemos validar con JavaScript es el FORMATO de ambos campos
// (RF-014, IE1.2.1). Si el formato es válido, simulamos un login exitoso.
//
// Etapa 7: además, buscamos el correo ingresado entre los usuarios
// "semilla" (data/usuarios.js) y los registrados desde registro.html, para
// que la sesión tome el ROL real de esa cuenta (administrador, vendedor o
// cliente) y roles.js pueda mostrar el panel admin correspondiente. Si el
// correo no se encuentra en ningún lado, inicia sesión igual como Cliente
// (no hay backend que rechace un login por credenciales "incorrectas").
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

    const sesion = crearSesionParaCorreo(correo.trim());
    localStorage.setItem(SESION_STORAGE_KEY, JSON.stringify(sesion));

    mensajeExito.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
    form.reset();

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  });
});

/**
 * Busca el correo ingresado entre los usuarios semilla (data/usuarios.js)
 * y los registrados desde registro.html (localStorage). Si lo encuentra,
 * la sesión toma el rol real de esa cuenta; si no, inicia sesión como
 * Cliente por defecto.
 */
function crearSesionParaCorreo(correo) {
  const usuariosRegistrados = JSON.parse(localStorage.getItem('grip_usuarios_registrados') || '[]');
  const todosLosUsuarios = [...usuarios, ...usuariosRegistrados];

  const encontrado = todosLosUsuarios.find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase()
  );

  if (encontrado) {
    return {
      correo: encontrado.correo,
      nombre: encontrado.nombre,
      rol: encontrado.tipoUsuario,
    };
  }

  return {
    correo,
    nombre: correo.split('@')[0],
    rol: 'cliente',
  };
}
