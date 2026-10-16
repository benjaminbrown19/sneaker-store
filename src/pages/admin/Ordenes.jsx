import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaOrdenes from '../../components/organisms/TablaOrdenes'
import { ordenesService } from '../../services/ordenesService'

export default function Ordenes() {
  return (
    <>
      <TituloSeccion titulo="Órdenes y boletas" subtitulo="Compras realizadas desde la tienda." />
      <TablaOrdenes ordenes={ordenesService.listarRecientes()} />
    </>
  )
}
