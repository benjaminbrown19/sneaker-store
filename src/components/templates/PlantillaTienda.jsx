import { Outlet } from 'react-router-dom'
import Encabezado from '../organisms/Encabezado'
import PiePagina from '../organisms/PiePagina'
import { useCarrito } from '../../context/CarritoContext'
import { useSesion } from '../../context/SesionContext'
import { categoriasService } from '../../services/categoriasService'

export default function PlantillaTienda() {
  const { cantidadTotal } = useCarrito()
  const { sesion, cerrarSesion } = useSesion()

  return (
    <div className="plantilla-tienda">
      <Encabezado cantidadCarrito={cantidadTotal} sesion={sesion} onCerrarSesion={cerrarSesion} />
      <main className="contenido-tienda">
        <Outlet />
      </main>
      <PiePagina categorias={categoriasService.listar()} />
    </div>
  )
}
