import Form from 'react-bootstrap/Form'

export default function Buscador({ valor, onChange, placeholder = 'Buscar productos...' }) {
  return (
    <Form.Control
      type="search"
      value={valor}
      placeholder={placeholder}
      aria-label="Buscar productos"
      onChange={(evento) => onChange(evento.target.value)}
    />
  )
}
