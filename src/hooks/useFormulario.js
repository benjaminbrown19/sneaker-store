import { useState } from 'react'
import { hayErrores } from '../utils/validaciones'

export function useFormulario(valoresIniciales, reglas) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})

  function validarCampo(nombre, valor, todos) {
    const regla = reglas[nombre]
    return regla ? regla(valor, todos) : null
  }

  function cambiar(nombre, valor, extra = {}) {
    const nuevos = { ...valores, [nombre]: valor, ...extra }
    setValores(nuevos)
    if (errores[nombre]) {
      setErrores({ ...errores, [nombre]: validarCampo(nombre, valor, nuevos) })
    }
  }

  function salirDeCampo(nombre) {
    setErrores((actuales) => ({ ...actuales, [nombre]: validarCampo(nombre, valores[nombre], valores) }))
  }

  function validarTodo() {
    const nuevos = {}
    Object.keys(reglas).forEach((nombre) => {
      nuevos[nombre] = validarCampo(nombre, valores[nombre], valores)
    })
    setErrores(nuevos)
    return !hayErrores(nuevos)
  }

  function reiniciar(nuevosValores = valoresIniciales) {
    setValores(nuevosValores)
    setErrores({})
  }

  function campo(nombre, id = nombre) {
    return {
      id,
      valor: valores[nombre] ?? '',
      error: errores[nombre] || null,
      onChange: (evento) => cambiar(nombre, evento.target.value),
      onBlur: () => salirDeCampo(nombre),
    }
  }

  return { valores, errores, cambiar, validarTodo, reiniciar, campo, setErrores }
}
