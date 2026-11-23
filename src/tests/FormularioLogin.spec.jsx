import { render, screen, fireEvent } from '@testing-library/react'
import FormularioLogin from '../components/organisms/FormularioLogin'

describe('FormularioLogin', () => {
  it('actualiza el valor de los campos cuando el usuario escribe (estado)', () => {
    render(<FormularioLogin onIniciar={() => ({ ok: true })} />)
    const correo = screen.getByLabelText('Correo electrónico')

    fireEvent.change(correo, { target: { value: 'ana@duoc.cl' } })

    expect(correo.value).toBe('ana@duoc.cl')
  })

  it('valida los campos obligatorios y la longitud mínima de la contraseña', () => {
    const onIniciar = jasmine.createSpy('onIniciar')
    render(<FormularioLogin onIniciar={onIniciar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(onIniciar).not.toHaveBeenCalled()
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@duoc.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(onIniciar).not.toHaveBeenCalled()
    expect(screen.getByText('Introduce al menos 8 caracteres.')).toBeInTheDocument()
  })

  it('llama a onIniciar con el correo y la contraseña cuando los datos son válidos', () => {
    const onIniciar = jasmine.createSpy('onIniciar').and.returnValue({ ok: true })
    render(<FormularioLogin onIniciar={onIniciar} />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@duoc.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(onIniciar).toHaveBeenCalledWith('ana@duoc.cl', '12345678')
  })

  it('muestra una alerta si el inicio de sesión falla', async () => {
    const onIniciar = jasmine.createSpy('onIniciar').and.returnValue(Promise.resolve({ ok: false }))
    render(<FormularioLogin onIniciar={onIniciar} />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@duoc.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible iniciar sesión')
  })
})
