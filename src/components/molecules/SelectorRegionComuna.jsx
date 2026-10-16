import { regiones } from '../../data/regiones'
import CampoFormulario from './CampoFormulario'

export function comunasDeRegion(valorRegion) {
  const region = regiones.find((candidata) => candidata.valor === valorRegion)
  return region ? region.comunas : []
}

export default function SelectorRegionComuna({ prefijo, campoRegion, campoComuna, onCambiarRegion }) {
  const opcionesRegion = regiones.map((region) => ({ valor: region.valor, etiqueta: region.nombre }))
  const comunas = comunasDeRegion(campoRegion.valor)
  const opcionesComuna = comunas.map((comuna) => ({ valor: comuna, etiqueta: comuna }))

  return (
    <>
      <CampoFormulario
        {...campoRegion}
        id={`${prefijo}-region`}
        etiqueta="Región"
        opciones={opcionesRegion}
        placeholder="Selecciona una región"
        onChange={(evento) => onCambiarRegion(evento.target.value)}
      />
      <CampoFormulario
        {...campoComuna}
        id={`${prefijo}-comuna`}
        etiqueta="Comuna"
        opciones={opcionesComuna}
        placeholder={campoRegion.valor ? 'Selecciona una comuna' : 'Primero elige una región'}
        deshabilitado={!campoRegion.valor}
      />
    </>
  )
}
