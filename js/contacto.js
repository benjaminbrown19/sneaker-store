// ==========================================================================
// GRIP Sneaker Store - js/contacto.js
// Validación y envío simulado del formulario de contacto (RF-015).
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById('contacto-nombre').value;
    const correo = document.getElementById('contacto-correo').value;
    const comentario = document.getElementById('contacto-comentario').value;
    const mensajeExito = document.getElementById('exito-contacto');

    let esValido = true;

    const validarCampo = (idInput, mensajeError) => {
      if (mensajeError) {
        mostrarError(idInput, mensajeError);
        esValido = false;
      } else {
        limpiarError(idInput);
      }
    };

    validarCampo('contacto-nombre', validarTexto(nombre, { max: 100, nombreCampo: 'El nombre' }));
    validarCampo('contacto-correo', validarEmail(correo));
    validarCampo('contacto-comentario', validarTexto(comentario, { max: 500, nombreCampo: 'El comentario' }));

    if (!esValido) {
      mensajeExito.textContent = '';
      return;
    }

    mensajeExito.textContent = 'Mensaje enviado correctamente. Te responderemos pronto.';
    form.reset();
  });
});
