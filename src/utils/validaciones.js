const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export function validarEmail(valorOriginal) {
  const email = (valorOriginal || '').trim()

  if (!email) return 'El correo es obligatorio.'
  if (email.length > 100) return 'El correo no puede superar los 100 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ingresa un correo con un formato válido (ej: nombre@dominio.cl).'
  }

  const dominio = email.split('@')[1].toLowerCase()
  if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
    return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }

  return null
}

export function validarTexto(valorOriginal, opciones = {}) {
  const { obligatorio = true, min = 0, max = 1000, nombreCampo = 'Este campo' } = opciones
  const texto = (valorOriginal || '').trim()

  if (obligatorio && !texto) return `${nombreCampo} es obligatorio.`
  if (texto && texto.length < min) return `${nombreCampo} debe tener al menos ${min} caracteres.`
  if (texto.length > max) return `${nombreCampo} no puede superar los ${max} caracteres.`

  return null
}

export function validarPassword(valorOriginal) {
  const password = valorOriginal || ''

  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 4 || password.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.'
  }

  return null
}

export function calcularDigitoVerificador(cuerpo) {
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}

export function validarRUN(valorOriginal) {
  const valor = (valorOriginal || '').trim().toUpperCase()

  if (!valor) return 'El RUN es obligatorio.'
  if (!/^[0-9]{6,8}[0-9K]$/.test(valor)) {
    return 'El RUN debe tener entre 7 y 9 caracteres, solo números y sin puntos ni guion (el último puede ser K).'
  }

  if (valor.slice(-1) !== calcularDigitoVerificador(valor.slice(0, -1))) {
    return 'El dígito verificador del RUN no es válido.'
  }

  return null
}

export function validarNumero(valorOriginal, opciones = {}) {
  const { obligatorio = true, min = 0, entero = false, nombreCampo = 'Este campo' } = opciones
  const texto = String(valorOriginal ?? '').trim()

  if (!texto) return obligatorio ? `${nombreCampo} es obligatorio.` : null

  const numero = Number(texto)
  if (Number.isNaN(numero)) return `${nombreCampo} debe ser un número.`
  if (entero && !Number.isInteger(numero)) return `${nombreCampo} debe ser un número entero.`
  if (numero < min) return `${nombreCampo} debe ser mayor o igual a ${min}.`

  return null
}

export function validarTarjeta(valorOriginal) {
  const digitos = (valorOriginal || '').replace(/\s/g, '')

  if (!digitos) return 'El número de tarjeta es obligatorio.'
  if (!/^[0-9]{16}$/.test(digitos)) return 'La tarjeta debe tener 16 dígitos.'

  return null
}

export function hayErrores(errores) {
  return Object.values(errores).some(Boolean)
}
