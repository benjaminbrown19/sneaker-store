import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'

export default function FormularioCupon({ cupon, onAplicar, onQuitar }) {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)

  function enviar(evento) {
    evento.preventDefault()
    const respuesta = onAplicar(codigo)
    setResultado(respuesta)
    if (respuesta.ok) setCodigo('')
  }

  return (
    <Form onSubmit={enviar} className="formulario-cupon" noValidate>
      <Form.Label htmlFor="cupon-codigo">¿Tienes un cupón?</Form.Label>
      <div className="d-flex gap-2">
        <Form.Control
          id="cupon-codigo"
          value={codigo}
          placeholder="Ej: GRIP10"
          onChange={(evento) => setCodigo(evento.target.value)}
        />
        <Boton tipo="submit" variante="oscuro">Aplicar</Boton>
      </div>
      {resultado && !resultado.ok && (
        <Mensaje variante="danger" className="mt-2 py-2">{resultado.mensaje}</Mensaje>
      )}
      {cupon && (
        <p className="cupon-activo mt-2 mb-0">
          Cupón <strong>{cupon.codigo}</strong> aplicado ({Math.round(cupon.porcentaje * 100)}% de descuento).{' '}
          <button type="button" className="enlace-boton" onClick={onQuitar}>Quitar</button>
        </p>
      )}
    </Form>
  )
}
