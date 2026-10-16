import { renderHook, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from '../context/CarritoContext'
import { productosService } from '../services/productosService'
import { productoEjemplo } from './utilidades'

const producto = { ...productoEjemplo, stock: 3 }

function envoltorio({ children }) {
  return <CarritoProvider>{children}</CarritoProvider>
}

describe('CarritoContext', () => {
  beforeEach(() => {
    spyOn(productosService, 'obtener').and.returnValue(producto)
    spyOn(productosService, 'listar').and.returnValue([producto])
  })

  it('agrega productos y suma la cantidad si ya estaban en el carrito', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })

    act(() => {
      result.current.agregar('SNK-001')
    })
    act(() => {
      result.current.agregar('SNK-001')
    })

    expect(result.current.items).toEqual([{ codigo: 'SNK-001', cantidad: 2 }])
    expect(result.current.cantidadTotal).toBe(2)
    expect(result.current.resumen.subtotal).toBe(109980)
  })

  it('no permite superar el stock disponible y devuelve un mensaje', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    let respuesta

    act(() => {
      respuesta = result.current.agregar('SNK-001', 5)
    })

    expect(respuesta.ok).toBeFalse()
    expect(respuesta.mensaje).toContain('Solo quedan 3 unidades')
    expect(result.current.cantidadTotal).toBe(0)
  })

  it('persiste el carrito en localStorage y lo recupera al montar de nuevo', () => {
    const primero = renderHook(() => useCarrito(), { wrapper: envoltorio })
    act(() => {
      primero.result.current.agregar('SNK-001', 2)
    })
    primero.unmount()

    expect(JSON.parse(localStorage.getItem('grip_carrito'))).toEqual([{ codigo: 'SNK-001', cantidad: 2 }])

    const segundo = renderHook(() => useCarrito(), { wrapper: envoltorio })
    expect(segundo.result.current.cantidadTotal).toBe(2)
  })

  it('aplica un cupón válido, rechaza uno inválido y puede quitarlo', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    let respuesta

    act(() => {
      result.current.agregar('SNK-001')
    })
    act(() => {
      respuesta = result.current.aplicarCupon('GRIP10')
    })
    expect(respuesta.ok).toBeTrue()
    expect(result.current.resumen.descuento).toBe(5499)

    act(() => {
      respuesta = result.current.aplicarCupon('NOEXISTE')
    })
    expect(respuesta.ok).toBeFalse()
    expect(result.current.cupon).toBeNull()
  })

  it('quita líneas y vacía el carrito', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })

    act(() => {
      result.current.agregar('SNK-001')
    })
    act(() => {
      result.current.quitar('SNK-001')
    })
    expect(result.current.items.length).toBe(0)

    act(() => {
      result.current.agregar('SNK-001')
    })
    act(() => {
      result.current.vaciar()
    })
    expect(result.current.cantidadTotal).toBe(0)
    expect(localStorage.getItem('grip_carrito')).toBeNull()
  })

  it('lanza un error claro si se usa fuera del proveedor', () => {
    spyOn(console, 'error')
    expect(() => renderHook(() => useCarrito())).toThrowError('useCarrito debe usarse dentro de <CarritoProvider>')
  })
})
