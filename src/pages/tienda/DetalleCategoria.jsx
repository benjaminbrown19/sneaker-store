import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import ListaProductos from '../../components/organisms/ListaProductos'
import { categoriasService } from '../../services/categoriasService'
import { productosService } from '../../services/productosService'
import { useAvisoCarrito } from '../../hooks/useAvisoCarrito'

export default function DetalleCategoria() {
  const { id } = useParams()
  const categoria = categoriasService.obtener(id)
  const { aviso, agregarConAviso } = useAvisoCarrito()

  if (!categoria) {
    return (
      <Container className="seccion-grip">
        <Mensaje variante="danger">No se encontró esa categoría.</Mensaje>
        <Link to="/categorias">Volver a categorías</Link>
      </Container>
    )
  }

  return (
    <Container className="seccion-grip">
      <nav aria-label="Ruta de navegación" className="mb-3">
        <Link to="/categorias">Categorías</Link> / {categoria.nombre}
      </nav>
      <TituloSeccion titulo={categoria.nombre} subtitulo={categoria.descripcion} />
      {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}
      <ListaProductos
        productos={productosService.listarPorCategoria(id)}
        onAgregar={agregarConAviso}
        mensajeVacio="Aún no hay productos en esta categoría."
      />
    </Container>
  )
}
