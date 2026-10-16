import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TarjetaCategoria from '../../components/molecules/TarjetaCategoria'
import { categoriasService } from '../../services/categoriasService'
import { productosService } from '../../services/productosService'

export default function Categorias() {
  const categorias = categoriasService.listar()

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Categorías" subtitulo="Elige el estilo que va contigo." />
      <Row xs={1} sm={2} lg={4} className="g-4">
        {categorias.map((categoria) => (
          <Col key={categoria.id}>
            <TarjetaCategoria
              categoria={categoria}
              cantidad={productosService.listarPorCategoria(categoria.id).length}
            />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
