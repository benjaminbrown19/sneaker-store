import { render, screen, fireEvent, within } from '@testing-library/react'
import FormularioUsuario from '../components/organisms/FormularioUsuario'

describe('FormularioUsuario', () => {
  it('mantiene la comuna deshabilitada hasta elegir una región y luego la llena', () => {
    render(<FormularioUsuario onGuardar={() => ({ ok: true })} />)
    const comuna = screen.getByLabelText('Comuna')
    expect(comuna).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'valparaiso' } })

    expect(screen.getByLabelText('Comuna')).not.toBeDisabled()
    const opciones = within(screen.getByLabelText('Comuna')).getAllByRole('option').map((opcion) => opcion.textContent)
    expect(opciones).toContain('Viña del Mar')
    expect(opciones).not.toContain('Santiago')
  })

  it('muestra error de dígito verificador al salir del campo RUN con un valor inválido', () => {
    render(<FormularioUsuario onGuardar={() => ({ ok: true })} />)
    const run = screen.getByLabelText('RUN')

    fireEvent.change(run, { target: { value: '11111111' } })
    fireEvent.blur(run)

    expect(screen.getByText(/dígito verificador/)).toBeInTheDocument()
    expect(run).toHaveClass('is-invalid')
  })

  it('no llama a onGuardar si hay campos inválidos', () => {
    const onGuardar = jasmine.createSpy('onGuardar')
    render(<FormularioUsuario onGuardar={onGuardar} textoBoton="Crear" />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    expect(onGuardar).not.toHaveBeenCalled()
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(3)
  })

  it('envía los datos sin la confirmación de contraseña cuando todo es válido', () => {
    const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: true })
    render(<FormularioUsuario conPassword onGuardar={onGuardar} textoBoton="Crear" />)

    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
    escribir('RUN', '201234565')
    escribir('Nombre', 'Valentina')
    escribir('Apellidos', 'Muñoz')
    escribir('Correo electrónico', 'valentina@gmail.com')
    escribir('Región', 'metropolitana')
    escribir('Comuna', 'Ñuñoa')
    escribir('Dirección', 'Pasaje Las Rosas 789')
    escribir('Contraseña', '1234')
    escribir('Confirmar contraseña', '1234')
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    expect(onGuardar).toHaveBeenCalledTimes(1)
    const datos = onGuardar.calls.mostRecent().args[0]
    expect(datos.run).toBe('201234565')
    expect(datos.password).toBe('1234')
    expect(datos.passwordConfirmar).toBeUndefined()
  })
})
