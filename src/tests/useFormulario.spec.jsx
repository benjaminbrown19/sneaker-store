import { renderHook, act } from '@testing-library/react'
import { useFormulario } from '../hooks/useFormulario'

const reglas = {
  nombre: (valor) => (valor ? null : 'Obligatorio'),
  clave: (valor, todos) => (valor === todos.nombre ? 'No puede ser igual al nombre' : null),
}

describe('useFormulario', () => {
  it('actualiza los valores al cambiar un campo', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '', clave: '' }, reglas))

    act(() => {
      result.current.cambiar('nombre', 'Ana')
    })

    expect(result.current.valores.nombre).toBe('Ana')
  })

  it('valida todo el formulario y expone los errores por campo', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '', clave: '' }, reglas))
    let valido

    act(() => {
      valido = result.current.validarTodo()
    })

    expect(valido).toBeFalse()
    expect(result.current.errores.nombre).toBe('Obligatorio')
  })

  it('revalida mientras se escribe solo si el campo ya tenía error', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '', clave: '' }, reglas))

    act(() => {
      result.current.cambiar('nombre', 'A')
    })
    expect(result.current.errores.nombre).toBeUndefined()

    act(() => {
      result.current.validarTodo()
    })
    act(() => {
      result.current.cambiar('nombre', 'Ana')
    })

    expect(result.current.errores.nombre).toBeNull()
  })

  it('reinicia los valores y limpia los errores', () => {
    const { result } = renderHook(() => useFormulario({ nombre: '', clave: '' }, reglas))

    act(() => {
      result.current.validarTodo()
    })
    act(() => {
      result.current.reiniciar()
    })

    expect(result.current.valores).toEqual({ nombre: '', clave: '' })
    expect(result.current.errores).toEqual({})
  })
})
