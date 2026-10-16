import { ordenesService } from '../services/ordenesService'

const datos = (correo) => ({
  cliente: { nombre: 'Ana', apellidos: 'Pérez', correo },
  items: [{ codigo: 'SNK-001', nombre: 'GRIP Street 90', cantidad: 1, precioUnitario: 54990, subtotal: 54990 }],
  total: 54990,
})

describe('ordenesService', () => {
  it('registra una orden con id y fecha generados', () => {
    const orden = ordenesService.registrar(datos('ana@duoc.cl'))

    expect(orden.id).toMatch(/^ORD-\d+$/)
    expect(new Date(orden.fecha).toString()).not.toBe('Invalid Date')
    expect(ordenesService.obtener(orden.id).total).toBe(54990)
  })

  it('lista las órdenes de un cliente por correo y las recientes primero', () => {
    const reloj = jasmine.clock()
    reloj.install()
    reloj.mockDate(new Date(2026, 9, 1))
    ordenesService.registrar(datos('ana@duoc.cl'))
    reloj.mockDate(new Date(2026, 9, 2))
    ordenesService.registrar(datos('otro@gmail.com'))
    reloj.mockDate(new Date(2026, 9, 3))
    const ultima = ordenesService.registrar(datos('ana@duoc.cl'))
    reloj.uninstall()

    expect(ordenesService.listarPorCorreo('ANA@duoc.cl').length).toBe(2)
    expect(ordenesService.listarRecientes()[0].id).toBe(ultima.id)
  })
})
