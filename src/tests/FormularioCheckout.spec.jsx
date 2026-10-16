import { render, screen, fireEvent } from '@testing-library/react'
import FormularioCheckout from '../components/organisms/FormularioCheckout'

const datos = { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl', region: 'valparaiso', comuna: 'Valparaíso', direccion: 'Calle 1' }

describe('FormularioCheckout', () => {
  it('muestra los campos de dirección solo con despacho a domicilio', () => {
    const { rerender } = render(
      <FormularioCheckout valoresIniciales={datos} tipoEntrega="domicilio" onCambiarTipoEntrega={() => {}} onPagar={() => {}} />,
    )
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument()

    rerender(<FormularioCheckout valoresIniciales={datos} tipoEntrega="retiro" onCambiarTipoEntrega={() => {}} onPagar={() => {}} />)
    expect(screen.queryByLabelText('Dirección')).not.toBeInTheDocument()
  })

  it('avisa al cambiar el tipo de entrega', () => {
    const onCambiarTipoEntrega = jasmine.createSpy('onCambiarTipoEntrega')
    render(<FormularioCheckout valoresIniciales={datos} tipoEntrega="domicilio" onCambiarTipoEntrega={onCambiarTipoEntrega} onPagar={() => {}} />)

    fireEvent.click(screen.getByRole('radio', { name: 'Retiro en tienda (gratis)' }))

    expect(onCambiarTipoEntrega).toHaveBeenCalledWith('retiro')
  })

  it('exige una tarjeta de 16 dígitos antes de pagar', () => {
    const onPagar = jasmine.createSpy('onPagar')
    render(<FormularioCheckout valoresIniciales={datos} tipoEntrega="domicilio" onCambiarTipoEntrega={() => {}} onPagar={onPagar} />)

    fireEvent.change(screen.getByLabelText('Número de tarjeta'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(onPagar).not.toHaveBeenCalled()
    expect(screen.getByText('La tarjeta debe tener 16 dígitos.')).toBeInTheDocument()
  })

  it('llama a onPagar con los datos cuando el formulario es válido', () => {
    const onPagar = jasmine.createSpy('onPagar')
    render(<FormularioCheckout valoresIniciales={datos} tipoEntrega="domicilio" onCambiarTipoEntrega={() => {}} onPagar={onPagar} />)

    fireEvent.change(screen.getByLabelText('Número de tarjeta'), { target: { value: '4111111111111111' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(onPagar).toHaveBeenCalledTimes(1)
    expect(onPagar.calls.mostRecent().args[0].tarjeta).toBe('4111111111111111')
  })
})
