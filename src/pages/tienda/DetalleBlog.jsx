import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Mensaje from '../../components/atoms/Mensaje'
import { blogs } from '../../data/blogs'

export default function DetalleBlog() {
  const { id } = useParams()
  const blog = blogs.find((candidato) => candidato.id === id)

  if (!blog) {
    return (
      <Container className="seccion-grip">
        <Mensaje variante="danger">No se encontró ese artículo.</Mensaje>
        <Link to="/blogs">Volver al blog</Link>
      </Container>
    )
  }

  return (
    <Container className="seccion-grip contenedor-articulo">
      <nav aria-label="Ruta de navegación" className="mb-3">
        <Link to="/">Home</Link> / <Link to="/blogs">Blog</Link> / {blog.titulo}
      </nav>
      <p className="tarjeta-blog-categoria">{blog.categoria}</p>
      <h1>{blog.titulo}</h1>
      <img src={blog.imagen} alt="" className="img-fluid mb-4" />
      {blog.contenido.map((bloque) => (
        <section key={bloque.subtitulo}>
          <h2 className="h5">{bloque.subtitulo}</h2>
          <p>{bloque.texto}</p>
        </section>
      ))}
      <p>¿Buscas tu próximo par? Revisa nuestro <Link to="/productos">catálogo completo</Link>.</p>
    </Container>
  )
}
