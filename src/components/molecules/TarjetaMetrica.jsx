export default function TarjetaMetrica({ etiqueta, valor, tono = 'neutro' }) {
  return (
    <article className={`tarjeta-metrica tarjeta-metrica-${tono}`}>
      <p className="tarjeta-metrica-etiqueta">{etiqueta}</p>
      <p className="tarjeta-metrica-valor">{valor}</p>
    </article>
  )
}
