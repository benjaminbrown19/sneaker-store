import Form from 'react-bootstrap/Form'

export default function CampoFormulario({
  id,
  etiqueta,
  tipo = 'text',
  valor,
  onChange,
  onBlur,
  error,
  opciones,
  placeholder,
  deshabilitado = false,
  filas = 4,
  ayuda,
  ...resto
}) {
  const idError = `error-${id}`
  const idAyuda = `ayuda-${id}`
  const descritoPor = [error ? idError : null, ayuda ? idAyuda : null].filter(Boolean).join(' ') || undefined
  const propiedades = {
    value: valor,
    onChange,
    onBlur,
    disabled: deshabilitado,
    isInvalid: Boolean(error),
    'aria-describedby': descritoPor,
    ...resto,
  }

  let control
  if (opciones) {
    control = (
      <Form.Select {...propiedades}>
        <option value="">{placeholder || 'Selecciona una opción'}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </Form.Select>
    )
  } else if (tipo === 'textarea') {
    control = <Form.Control as="textarea" rows={filas} placeholder={placeholder} {...propiedades} />
  } else {
    control = <Form.Control type={tipo} placeholder={placeholder} {...propiedades} />
  }

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      {control}
      {ayuda && (
        <Form.Text id={idAyuda} muted>
          {ayuda}
        </Form.Text>
      )}
      {error && (
        <Form.Control.Feedback type="invalid" id={idError} role="alert">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}
