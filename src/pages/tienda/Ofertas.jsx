import Container from 'react-bootstrap/Container'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import ListaProductos from '../../components/organisms/ListaProductos'
import { productosService } from '../../services/productosService'
import { useAvisoCarrito } from '../../hooks/useAvisoCarrito'

export default function Ofertas() {
  const { aviso, agregarConAviso } = useAvisoCarrito()

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Ofertas" subtitulo="Pares seleccionados con descuento por tiempo limitado." />
      {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}
      <ListaProductos
        productos={productosService.listarOfertas()}
        onAgregar={agregarConAviso}
        mensajeVacio="Por ahora no hay productos en oferta."
      />
    </Container>
  )
}
