import { render, screen, fireEvent } from '@testing-library/react'
import FormularioProducto from '../components/organisms/FormularioProducto'

const categorias = [
  { id: 'urbano', nombre: 'Urbano' },
  { id: 'skate', nombre: 'Skate' },
]

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('FormularioProducto', () => {
  it('muestra errores y no guarda si faltan los campos obligatorios', () => {
    const onGuardar = jasmine.createSpy('onGuardar')
    render(<FormularioProducto categorias={categorias} onGuardar={onGuardar} textoBoton="Crear" />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    expect(onGuardar).not.toHaveBeenCalled()
    expect(screen.getByText(/El código debe tener al menos 3 caracteres|El código es obligatorio/)).toBeInTheDocument()
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument()
  })

  it('convierte los valores numéricos y normaliza el código al guardar', () => {
    const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: true })
    render(<FormularioProducto categorias={categorias} onGuardar={onGuardar} textoBoton="Crear" />)

    escribir('Código', 'snk-050')
    escribir('Nombre', 'GRIP Prueba')
    escribir('Precio (CLP)', '59990')
    escribir('Stock', '7')
    escribir('Categoría', 'skate')
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    expect(onGuardar).toHaveBeenCalledTimes(1)
    const producto = onGuardar.calls.mostRecent().args[0]
    expect(producto.codigo).toBe('SNK-050')
    expect(producto.precio).toBe(59990)
    expect(producto.stock).toBe(7)
    expect(producto.descuento).toBe(0)
  })

  it('bloquea el código al editar y rechaza un descuento mayor al 90%', () => {
    render(
      <FormularioProducto
        categorias={categorias}
        codigoBloqueado
        valoresIniciales={{ codigo: 'SNK-001', nombre: 'GRIP', precio: '1000', stock: '1', categoria: 'urbano' }}
        onGuardar={() => ({ ok: true })}
        textoBoton="Guardar"
      />,
    )

    expect(screen.getByLabelText('Código')).toBeDisabled()
    escribir('Descuento (%)', '95')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('El descuento no puede superar el 90%.')).toBeInTheDocument()
  })
})
