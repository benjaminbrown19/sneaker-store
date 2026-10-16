import { productosService, CLAVE_PRODUCTOS } from '../services/productosService'
import { productosSeed } from '../data/productos.seed'

describe('productosService', () => {
  it('carga los datos semilla la primera vez y los guarda en localStorage', () => {
    const espiaGuardar = spyOn(Storage.prototype, 'setItem').and.callThrough()

    const productos = productosService.listar()

    expect(productos.length).toBe(productosSeed.length)
    expect(espiaGuardar).toHaveBeenCalledWith(CLAVE_PRODUCTOS, jasmine.any(String))
  })

  it('crea un producto, impide duplicar el código y permite actualizarlo y eliminarlo', () => {
    const nuevo = { ...productosSeed[0], codigo: 'SNK-100', nombre: 'GRIP Nuevo' }

    expect(productosService.crear(nuevo).ok).toBeTrue()
    expect(productosService.crear(nuevo).ok).toBeFalse()

    productosService.actualizar('SNK-100', { stock: 99 })
    expect(productosService.obtener('SNK-100').stock).toBe(99)

    expect(productosService.eliminar('SNK-100').ok).toBeTrue()
    expect(productosService.obtener('SNK-100')).toBeNull()
  })

  it('lista los productos con stock crítico y los que están en oferta', () => {
    const criticos = productosService.listarCriticos().map((producto) => producto.codigo)
    const ofertas = productosService.listarOfertas().map((producto) => producto.codigo)

    expect(criticos).toEqual(['SNK-003'])
    expect(ofertas).toEqual(['SNK-002', 'SNK-005', 'SNK-008'])
  })

  it('descuenta el stock de los productos vendidos sin bajar de cero', () => {
    productosService.descontarStock([
      { codigo: 'SNK-001', cantidad: 2 },
      { codigo: 'SNK-003', cantidad: 10 },
    ])

    expect(productosService.obtener('SNK-001').stock).toBe(16)
    expect(productosService.obtener('SNK-003').stock).toBe(0)
  })

  it('se recupera si el contenido guardado está corrupto', () => {
    localStorage.setItem(CLAVE_PRODUCTOS, '{no es json')

    expect(productosService.listar().length).toBe(productosSeed.length)
  })
})
