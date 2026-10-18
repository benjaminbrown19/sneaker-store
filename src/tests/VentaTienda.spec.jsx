import { screen, fireEvent, within } from '@testing-library/react'
import App from '../App'
import { renderConProveedores } from './utilidades'
import { productosService } from '../services/productosService'
import { ordenesService } from '../services/ordenesService'

function iniciarSesionComoVendedor(correo = 'carlos.soto@duoc.cl') {
  localStorage.setItem('grip_sesion', JSON.stringify({ id: 'USR-X', correo, nombre: 'Carlos', rol: 'vendedor' }))
}

function renderVenta() {
  iniciarSesionComoVendedor()
  return renderConProveedores(<App />, '/admin/venta')
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function agregarProducto(codigo, cantidad = '1') {
  escribir('Producto', codigo)
  escribir('Cantidad', cantidad)
  fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
}

function completarCliente() {
  escribir('Nombre del cliente', 'Juan')
  escribir('Apellidos del cliente', 'Pérez')
}

describe('Venta en tienda (vendedor)', () => {
  it('muestra un error si la sesión no corresponde a un vendedor registrado', () => {
    iniciarSesionComoVendedor('nadie@duoc.cl')
    renderConProveedores(<App />, '/admin/venta')

    expect(screen.getByText('Tu sesión no está asociada a una cuenta de vendedor registrada.')).toBeInTheDocument()
  })

  it('muestra el vendedor y ofrece solo productos con stock disponible', () => {
    productosService.reemplazarTodo(
      productosService.listar().map((producto) => (producto.codigo === 'SNK-001' ? { ...producto, stock: 0 } : producto)),
    )
    renderVenta()

    expect(screen.getByText(/Vendedor: Carlos Soto/)).toBeInTheDocument()
    const select = screen.getByLabelText('Producto')
    const opciones = within(select).getAllByRole('option').map((opcion) => opcion.value)
    expect(opciones).not.toContain('SNK-001')
    expect(opciones).toContain('SNK-003')
  })

  it('agrega un producto al detalle de la venta y permite quitarlo', () => {
    renderVenta()
    agregarProducto('SNK-001', '2')

    const resumen = screen.getByRole('complementary', { name: 'Resumen de la venta' })
    expect(within(resumen).getByText('GRIP Street 90')).toBeInTheDocument()

    fireEvent.click(within(resumen).getByRole('button', { name: 'Quitar' }))
    expect(screen.getByText('Todavía no hay productos en la venta.')).toBeInTheDocument()
  })

  it('no permite agregar más unidades que el stock disponible', () => {
    renderVenta()
    agregarProducto('SNK-003', '5')

    expect(screen.getByText('Solo quedan 3 unidades de GRIP Court Pro.')).toBeInTheDocument()
    expect(screen.getByText('Todavía no hay productos en la venta.')).toBeInTheDocument()
  })

  it('no registra la venta sin productos', () => {
    renderVenta()
    completarCliente()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar venta' }))

    expect(screen.getByText('Agrega al menos un producto a la venta.')).toBeInTheDocument()
    expect(ordenesService.listar().length).toBe(0)
  })

  it('registra una venta en efectivo, descuenta stock y no muestra comprobante', () => {
    renderVenta()
    completarCliente()
    agregarProducto('SNK-002', '2')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar venta' }))

    expect(screen.getByText(/registrada para Juan Pérez/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Comprobante de pago con tarjeta' })).not.toBeInTheDocument()

    const orden = ordenesService.listarRecientes()[0]
    expect(orden.canal).toBe('vendedor')
    expect(orden.pago).toEqual({ metodo: 'efectivo' })
    expect(productosService.obtener('SNK-002').stock).toBe(10)
  })

  it('exige los 4 últimos dígitos y el código de autorización al pagar con débito', () => {
    renderVenta()
    completarCliente()
    agregarProducto('SNK-001')
    fireEvent.click(screen.getByRole('radio', { name: 'Débito' }))
    fireEvent.click(screen.getByRole('button', { name: 'Registrar venta' }))

    expect(screen.getByText('Ingresa los 4 últimos dígitos de la tarjeta.')).toBeInTheDocument()
    expect(screen.getByText('El código de autorización debe tener entre 4 y 8 dígitos.')).toBeInTheDocument()
    expect(ordenesService.listar().length).toBe(0)
  })

  it('registra una venta con crédito en cuotas y muestra el comprobante', () => {
    renderVenta()
    completarCliente()
    agregarProducto('SNK-001')
    fireEvent.click(screen.getByRole('radio', { name: 'Crédito' }))
    escribir('Cuotas', '3')
    escribir('Últimos 4 dígitos de la tarjeta', '1234')
    escribir('Código de autorización', '987654')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar venta' }))

    expect(screen.getByRole('heading', { name: 'Comprobante de pago con tarjeta' })).toBeInTheDocument()
    expect(screen.getByText('Crédito, 3 cuotas')).toBeInTheDocument()
    expect(screen.getByText('**** 1234')).toBeInTheDocument()
    expect(screen.getByText('987654')).toBeInTheDocument()

    const orden = ordenesService.listarRecientes()[0]
    expect(orden.pago).toEqual({ metodo: 'credito', ultimos4: '1234', codigoAutorizacion: '987654', cuotas: 3 })
    expect(productosService.obtener('SNK-001').stock).toBe(17)
  })
})
