import { renderHook, act } from '@testing-library/react'
import { useAvisoCarrito } from '../hooks/useAvisoCarrito'
import { CarritoProvider } from '../context/CarritoContext'

function envoltorio({ children }) {
  return <CarritoProvider>{children}</CarritoProvider>
}

describe('useAvisoCarrito', () => {
  let reloj

  beforeEach(() => {
    reloj = jasmine.clock()
    reloj.install()
  })

  afterEach(() => {
    reloj.uninstall()
  })

  it('empieza sin aviso', () => {
    const { result } = renderHook(() => useAvisoCarrito(), { wrapper: envoltorio })

    expect(result.current.aviso).toBeNull()
  })

  it('muestra una confirmación y agrega el producto al carrito', () => {
    const { result } = renderHook(() => useAvisoCarrito(), { wrapper: envoltorio })

    let resultado
    act(() => {
      resultado = result.current.agregarConAviso('SNK-001')
    })

    expect(resultado.ok).toBeTrue()
    expect(result.current.aviso).toEqual({ variante: 'success', texto: 'Producto añadido al carrito.' })
  })

  it('muestra el motivo cuando el producto no tiene stock suficiente', () => {
    const { result } = renderHook(() => useAvisoCarrito(), { wrapper: envoltorio })

    let resultado
    act(() => {
      resultado = result.current.agregarConAviso('SNK-003', 5)
    })

    expect(resultado.ok).toBeFalse()
    expect(result.current.aviso).toEqual({
      variante: 'danger',
      texto: 'Solo quedan 3 unidades de GRIP Court Pro.',
    })
  })

  it('oculta el aviso después de 2,5 segundos', () => {
    const { result } = renderHook(() => useAvisoCarrito(), { wrapper: envoltorio })

    act(() => {
      result.current.agregarConAviso('SNK-001')
    })
    expect(result.current.aviso).not.toBeNull()

    act(() => {
      reloj.tick(2499)
    })
    expect(result.current.aviso).not.toBeNull()

    act(() => {
      reloj.tick(1)
    })
    expect(result.current.aviso).toBeNull()
  })
})
