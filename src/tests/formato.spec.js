import { formatearPrecio, precioFinal, capitalizar } from '../utils/formato'

describe('formato', () => {
  it('formatea precios en pesos chilenos', () => {
    expect(formatearPrecio(54990)).toBe('$54.990')
    expect(formatearPrecio(0)).toBe('$0')
  })

  it('calcula el precio final aplicando el descuento y redondeando', () => {
    expect(precioFinal({ precio: 64990, descuento: 15 })).toBe(55242)
    expect(precioFinal({ precio: 54990, descuento: 0 })).toBe(54990)
    expect(precioFinal({ precio: 54990 })).toBe(54990)
  })

  it('capitaliza la primera letra y tolera valores vacíos', () => {
    expect(capitalizar('urbano')).toBe('Urbano')
    expect(capitalizar('')).toBe('')
    expect(capitalizar(undefined)).toBe('')
  })
})
