import { ordenesApi } from '../services/ordenesApi'

const datosOrden = {
  cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com' },
  items: [{ codigo: 'SNK-001', cantidad: 2 }],
}

describe('ordenesApi (integración REST de órdenes)', () => {
  it('usa el endpoint público /ordenes/checkout para compras online', async () => {
    await ordenesApi.crear({ ...datosOrden, canal: 'online' })

    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url.endsWith('/ordenes/checkout')).toBeTrue()
    expect(opciones.method).toBe('POST')
  })

  it('usa /ordenes (protegido) para ventas atendidas por un vendedor', async () => {
    await ordenesApi.crear({
      ...datosOrden,
      canal: 'vendedor',
      vendedor: { nombre: 'Carlos', correo: 'carlos.soto@duoc.cl' },
    })

    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url.endsWith('/ordenes')).toBeTrue()
    expect(JSON.parse(opciones.body).vendedor.nombre).toBe('Carlos')
  })

  it('envía solo código y cantidad por línea: el precio lo calcula el servidor', async () => {
    await ordenesApi.crear({
      ...datosOrden,
      items: [{ codigo: 'SNK-001', cantidad: '2', precioUnitario: 1 }],
    })

    const cuerpo = JSON.parse(window.fetch.calls.mostRecent().args[1].body)
    expect(cuerpo.items).toEqual([{ codigo: 'SNK-001', cantidad: 2 }])
  })

  it('normaliza la orden devuelta con valores por defecto seguros', async () => {
    const orden = await ordenesApi.crear(datosOrden)

    expect(orden.id).toContain('ORD-TEST')
    expect(orden.total).toEqual(jasmine.any(Number))
    expect(orden.entrega.tipo).toBe('retiro')
    expect(orden.items[0].cantidad).toBe(2)
  })

  it('lista las órdenes más recientes primero', async () => {
    await ordenesApi.crear({ ...datosOrden, items: [{ codigo: 'SNK-001', cantidad: 1 }] })
    await ordenesApi.crear({ ...datosOrden, items: [{ codigo: 'SNK-002', cantidad: 1 }] })

    const recientes = await ordenesApi.listarRecientes()

    expect(recientes.length).toBe(2)
    expect(new Date(recientes[0].fecha) >= new Date(recientes[1].fecha)).toBeTrue()
  })

  it('filtra por correo sin distinguir mayúsculas', async () => {
    await ordenesApi.crear(datosOrden)
    await ordenesApi.crear({ ...datosOrden, cliente: { nombre: 'Otro', correo: 'otro@gmail.com' } })

    const propias = await ordenesApi.listarPorCorreo('ANA@gmail.com')

    expect(propias.length).toBe(1)
    expect(propias[0].cliente.nombre).toBe('Ana')
  })

  it('propaga el error del servidor cuando el stock es insuficiente', async () => {
    await expectAsync(
      ordenesApi.crear({ ...datosOrden, items: [{ codigo: 'SNK-001', cantidad: 9999 }] }),
    ).toBeRejectedWithError('Stock insuficiente.')
  })

  it('devuelve el detalle de una orden por id', async () => {
    const creada = await ordenesApi.crear(datosOrden)

    const detalle = await ordenesApi.obtener(creada.id)

    expect(detalle.id).toBe(creada.id)
  })
})
