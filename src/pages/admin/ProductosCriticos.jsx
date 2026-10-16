import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaProductos from '../../components/organisms/TablaProductos'
import { useSesion } from '../../context/SesionContext'
import { productosService } from '../../services/productosService'

export default function ProductosCriticos() {
  const { sesion } = useSesion()

  return (
    <>
      <TituloSeccion
        titulo="Productos críticos"
        subtitulo="Productos cuyo stock está en el nivel crítico o por debajo."
      />
      <TablaProductos productos={productosService.listarCriticos()} puedeEditar={sesion.rol === 'administrador'} onEliminar={() => {}} />
    </>
  )
}
