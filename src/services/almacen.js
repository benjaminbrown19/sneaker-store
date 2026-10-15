export function leer(clave, porDefecto) {
  try {
    const crudo = localStorage.getItem(clave)
    if (crudo === null) return porDefecto
    const dato = JSON.parse(crudo)
    return dato ?? porDefecto
  } catch {
    return porDefecto
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export function borrar(clave) {
  try {
    localStorage.removeItem(clave)
  } catch {
    return
  }
}
