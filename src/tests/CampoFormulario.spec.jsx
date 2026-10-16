import { render, screen, fireEvent, within } from '@testing-library/react'
import CampoFormulario from '../components/molecules/CampoFormulario'

describe('CampoFormulario', () => {
  it('muestra el mensaje de error y marca el campo como inválido solo si hay error', () => {
    const { rerender } = render(<CampoFormulario id="correo" etiqueta="Correo" valor="" onChange={() => {}} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).not.toHaveClass('is-invalid')

    rerender(<CampoFormulario id="correo" etiqueta="Correo" valor="" onChange={() => {}} error="El correo es obligatorio." />)

    const campo = screen.getByLabelText('Correo')
    expect(screen.getByRole('alert')).toHaveTextContent('El correo es obligatorio.')
    expect(campo).toHaveClass('is-invalid')
    expect(campo.getAttribute('aria-describedby')).toBe('error-correo')
  })

  it('ejecuta onChange con lo que escribe el usuario', () => {
    const valoresRecibidos = []
    const onChange = jasmine.createSpy('onChange').and.callFake((evento) => valoresRecibidos.push(evento.target.value))
    render(<CampoFormulario id="nombre" etiqueta="Nombre" valor="" onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(valoresRecibidos).toEqual(['Ana'])
  })

  it('renderiza un select con la opción inicial y las opciones recibidas', () => {
    render(
      <CampoFormulario
        id="categoria"
        etiqueta="Categoría"
        valor=""
        onChange={() => {}}
        placeholder="Elige una"
        opciones={[
          { valor: 'urbano', etiqueta: 'Urbano' },
          { valor: 'skate', etiqueta: 'Skate' },
        ]}
      />,
    )

    const opciones = within(screen.getByLabelText('Categoría')).getAllByRole('option')
    expect(opciones.map((opcion) => opcion.textContent)).toEqual(['Elige una', 'Urbano', 'Skate'])
  })
})
