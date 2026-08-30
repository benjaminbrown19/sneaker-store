// ==========================================================================
// GRIP Sneaker Store - js/validaciones.js
//
// Funciones de validación REUTILIZABLES por login.js, registro.js,
// contacto.js y (más adelante) los formularios de admin. Ningún formulario
// llama a estas funciones automáticamente: cada archivo (login.js,
// registro.js, etc.) las importa "por convención" al estar cargado antes
// en el <script> del HTML, y las invoca explícitamente en su propio
// listener de "submit".
//
// Convención de nombres: cada input tiene su párrafo de error asociado
// con el id "error-<idDelInput>" (ej. input#registro-run junto a
// <p id="error-registro-run">). mostrarError()/limpiarError() dependen
// de que esa convención se respete en el HTML.
// ==========================================================================

/**
 * Valida un correo electrónico: obligatorio, máx. 100 caracteres y
 * dominio dentro de la lista permitida por el curso.
 * @returns {string|null} mensaje de error, o null si es válido
 */
function validarEmail(valorOriginal) {
  const email = (valorOriginal || '').trim();

  if (!email) {
    return 'El correo es obligatorio.';
  }
  if (email.length > 100) {
    return 'El correo no puede superar los 100 caracteres.';
  }

  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!formatoValido) {
    return 'Ingresa un correo con un formato válido (ej: nombre@dominio.cl).';
  }

  const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
  const dominio = email.split('@')[1].toLowerCase();
  if (!dominiosPermitidos.includes(dominio)) {
    return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }

  return null;
}

/**
 * Valida un texto genérico (nombre, apellidos, dirección, comentario, etc.)
 * @param {string} valorOriginal
 * @param {{obligatorio?: boolean, min?: number, max?: number, nombreCampo?: string}} opciones
 * @returns {string|null}
 */
function validarTexto(valorOriginal, opciones) {
  const {
    obligatorio = true,
    min = 0,
    max = 1000,
    nombreCampo = 'Este campo',
  } = opciones || {};

  const texto = (valorOriginal || '').trim();

  if (obligatorio && !texto) {
    return `${nombreCampo} es obligatorio.`;
  }
  if (texto && texto.length < min) {
    return `${nombreCampo} debe tener al menos ${min} caracteres.`;
  }
  if (texto.length > max) {
    return `${nombreCampo} no puede superar los ${max} caracteres.`;
  }

  return null;
}

/**
 * Valida una contraseña: obligatoria, entre 4 y 10 caracteres.
 */
function validarPassword(valorOriginal) {
  const password = valorOriginal || '';

  if (!password) {
    return 'La contraseña es obligatoria.';
  }
  if (password.length < 4 || password.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.';
  }

  return null;
}

/**
 * Calcula el dígito verificador de un RUN chileno usando el algoritmo
 * del módulo 11 (el mismo que usa el Servicio de Registro Civil).
 * @param {string} rutSinDV solo dígitos, sin el dígito verificador
 * @returns {string} '0'-'9' o 'K'
 */
function calcularDigitoVerificador(rutSinDV) {
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDV[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

/**
 * Valida un RUN chileno: obligatorio, sin puntos ni guion, entre 7 y 9
 * caracteres, y con el dígito verificador correcto.
 */
function validarRUN(valorOriginal) {
  const valor = (valorOriginal || '').trim().toUpperCase();

  if (!valor) {
    return 'El RUN es obligatorio.';
  }
  if (!/^[0-9]{6,8}[0-9K]$/.test(valor)) {
    return 'El RUN debe tener entre 7 y 9 caracteres, solo números y sin puntos ni guion (el último caracter puede ser K).';
  }

  const cuerpo = valor.slice(0, -1);
  const dvIngresado = valor.slice(-1);
  const dvEsperado = calcularDigitoVerificador(cuerpo);

  if (dvIngresado !== dvEsperado) {
    return 'El dígito verificador del RUN no es válido. Revisa que lo hayas escrito correctamente.';
  }

  return null;
}

/**
 * Muestra un mensaje de error bajo el input indicado (usando la
 * convención error-<idDelInput>) y marca visualmente el campo como inválido.
 */
function mostrarError(idInput, mensaje) {
  const input = document.getElementById(idInput);
  const parrafoError = document.getElementById(`error-${idInput}`);

  if (parrafoError) parrafoError.textContent = mensaje;
  if (input) input.classList.add('input-invalido');
}

/**
 * Limpia el mensaje de error y la marca visual de un campo.
 */
function limpiarError(idInput) {
  const input = document.getElementById(idInput);
  const parrafoError = document.getElementById(`error-${idInput}`);

  if (parrafoError) parrafoError.textContent = '';
  if (input) input.classList.remove('input-invalido');
}
