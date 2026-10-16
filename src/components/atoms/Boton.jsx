import Button from 'react-bootstrap/Button'

const VARIANTES = {
  primario: 'warning',
  secundario: 'outline-dark',
  peligro: 'outline-danger',
  oscuro: 'dark',
}

export default function Boton({
  variante = 'primario',
  tamano,
  tipo = 'button',
  deshabilitado = false,
  onClick,
  className = '',
  children,
  ...resto
}) {
  return (
    <Button
      variant={VARIANTES[variante] ?? variante}
      size={tamano}
      type={tipo}
      disabled={deshabilitado}
      onClick={onClick}
      className={`boton-grip ${className}`.trim()}
      {...resto}
    >
      {children}
    </Button>
  )
}
