import Badge from 'react-bootstrap/Badge'

const TONOS = {
  oferta: 'danger',
  critico: 'danger',
  ok: 'success',
  neutro: 'secondary',
  info: 'primary',
}

export default function Insignia({ tono = 'neutro', className = '', children }) {
  return (
    <Badge bg={TONOS[tono] ?? tono} className={`insignia-grip ${className}`.trim()}>
      {children}
    </Badge>
  )
}
