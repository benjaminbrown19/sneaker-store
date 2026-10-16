import Alert from 'react-bootstrap/Alert'

export default function Mensaje({ variante = 'info', className = '', children }) {
  const rol = variante === 'danger' ? 'alert' : 'status'
  return (
    <Alert variant={variante} role={rol} className={className}>
      {children}
    </Alert>
  )
}
