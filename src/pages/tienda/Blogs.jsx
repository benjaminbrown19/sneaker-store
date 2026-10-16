import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TarjetaBlog from '../../components/molecules/TarjetaBlog'
import { blogs } from '../../data/blogs'

export default function Blogs() {
  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Blog GRIP" subtitulo="Consejos de cuidado, tendencias y cultura sneaker." />
      <Row xs={1} md={2} className="g-4">
        {blogs.map((blog) => (
          <Col key={blog.id}>
            <TarjetaBlog blog={blog} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
