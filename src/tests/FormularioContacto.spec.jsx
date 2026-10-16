import { render, screen, fireEvent } from '@testing-library/react'
import FormularioContacto from '../components/organisms/FormularioContacto'

function completar(nombre, correo, comentario) {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: nombre } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Comentario'), { target: { value: comentario } })
}

describe('FormularioContacto', () => {
  it('muestra los tres errores si se envía vacío', () => {
    const onEnviar = jasmine.createSpy('onEnviar')
    render(<FormularioContacto onEnviar={onEnviar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getAllByRole('alert').length).toBe(3)
    expect(onEnviar).not.toHaveBeenCalled()
  })

  it('envía los datos, limpia el formulario y confirma el envío', () => {
    const onEnviar = jasmine.createSpy('onEnviar')
    render(<FormularioContacto onEnviar={onEnviar} />)

    completar('Ana', 'ana@gmail.com', 'Hola, tengo una duda.')
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(onEnviar).toHaveBeenCalledWith({ nombre: 'Ana', correo: 'ana@gmail.com', comentario: 'Hola, tengo una duda.' })
    expect(screen.getByText('Mensaje enviado. Te responderemos pronto.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre').value).toBe('')
  })
})
