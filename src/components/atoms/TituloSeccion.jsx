export default function TituloSeccion({ titulo, subtitulo, nivel = 1, className = '' }) {
  const Etiqueta = `h${nivel}`
  return (
    <header className={`titulo-seccion ${className}`.trim()}>
      <Etiqueta>{titulo}</Etiqueta>
      {subtitulo && <p className="titulo-seccion-sub">{subtitulo}</p>}
    </header>
  )
}
