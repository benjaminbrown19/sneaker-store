import { render, screen, fireEvent } from '@testing-library/react'
import FormularioCupon from '../components/molecules/FormularioCupon'

describe('FormularioCupon', () => {
  it('envía el código escrito a onAplicar y limpia el campo si fue válido', () => {
    const onAplicar = jasmine.createSpy('onAplicar').and.returnValue({ ok: true })
    render(<FormularioCupon cupon={null} onAplicar={onAplicar} onQuitar={() => {}} />)

    fireEvent.change(screen.getByLabelText('¿Tienes un cupón?'), { target: { value: 'GRIP10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(onAplicar).toHaveBeenCalledWith('GRIP10')
    expect(screen.getByLabelText('¿Tienes un cupón?').value).toBe('')
  })

  it('muestra el mensaje de error cuando el cupón no es válido', () => {
    const onAplicar = jasmine.createSpy('onAplicar').and.returnValue({ ok: false, mensaje: 'Ese cupón no es válido.' })
    render(<FormularioCupon cupon={null} onAplicar={onAplicar} onQuitar={() => {}} />)

    fireEvent.change(screen.getByLabelText('¿Tienes un cupón?'), { target: { value: 'XXX' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ese cupón no es válido.')
  })

  it('muestra el cupón activo y permite quitarlo', () => {
    const onQuitar = jasmine.createSpy('onQuitar')
    render(<FormularioCupon cupon={{ codigo: 'GRIP20', porcentaje: 0.2 }} onAplicar={() => {}} onQuitar={onQuitar} />)

    expect(screen.getByText(/20% de descuento/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }))

    expect(onQuitar).toHaveBeenCalledTimes(1)
  })
})
