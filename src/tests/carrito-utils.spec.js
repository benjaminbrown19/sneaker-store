import { armarLineas, buscarCupon, calcularEnvio, calcularResumen } from '../utils/carrito'
import { productoEjemplo } from './utilidades'

describe('utilidades del carrito', () => {
  const productos = [productoEjemplo, { ...productoEjemplo, codigo: 'SNK-002', precio: 64990, descuento: 15 }]

  it('arma las líneas usando el precio con descuento y descarta códigos inexistentes', () => {
    const lineas = armarLineas(
      [
        { codigo: 'SNK-002', cantidad: 2 },
        { codigo: 'NO-EXISTE', cantidad: 1 },
      ],
      productos,
    )

    expect(lineas.length).toBe(1)
    expect(lineas[0].precioUnitario).toBe(55242)
    expect(lineas[0].subtotal).toBe(110484)
  })

  it('aplica el cupón sobre el subtotal', () => {
    const lineas = armarLineas([{ codigo: 'SNK-001', cantidad: 1 }], productos)
    const resumen = calcularResumen(lineas, { codigo: 'GRIP10', porcentaje: 0.1 })

    expect(resumen.subtotal).toBe(54990)
    expect(resumen.descuento).toBe(5499)
    expect(resumen.total).toBe(49491)
  })

  it('cobra envío bajo el mínimo, es gratis sobre él y en retiro en tienda', () => {
    expect(calcularEnvio(30000, 'domicilio')).toBe(3990)
    expect(calcularEnvio(50000, 'domicilio')).toBe(0)
    expect(calcularEnvio(30000, 'retiro')).toBe(0)
  })

  it('busca cupones sin distinguir mayúsculas y devuelve null si no existe', () => {
    expect(buscarCupon('grip20')).toEqual({ codigo: 'GRIP20', porcentaje: 0.2 })
    expect(buscarCupon('FALSO')).toBeNull()
  })
})
