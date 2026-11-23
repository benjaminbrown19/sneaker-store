import { productosApi } from '../services/productosApi'
import { productosService } from '../services/productosService'

describe('productosApi (integración REST)', () => {
  it('elimina un producto mediante DELETE y sincroniza el repositorio local', async () => {
    const iniciales = await productosApi.listar()
    expect(iniciales.some((producto) => producto.codigo === 'SNK-004')).toBe(true)

    await productosApi.eliminar('SNK-004')

    const restantes = await productosApi.listar()
    expect(restantes.some((producto) => producto.codigo === 'SNK-004')).toBe(false)
    expect(productosService.obtener('SNK-004')).toBeNull()
  })
})
