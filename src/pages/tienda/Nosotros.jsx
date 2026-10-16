import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'

const VALORES = [
  { titulo: 'Autenticidad', texto: 'Solo trabajamos con distribuidores autorizados.' },
  { titulo: 'Cercanía', texto: 'Atención real, sin respuestas automáticas genéricas.' },
  { titulo: 'Comunidad', texto: 'Contenido y eventos para quienes viven la cultura sneaker.' },
]

export default function Nosotros() {
  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Nosotros" subtitulo="Nuestra historia" />
      <Row className="g-4 align-items-center">
        <Col md={7}>
          <p>
            GRIP nació en 2023 como un proyecto entre amigos amantes de las zapatillas, cansados de comprar pares
            que se veían distintos a como llegaban. Hoy somos una tienda online dedicada exclusivamente a sneakers
            urbanos, deportivos y de skate, con curaduría propia y atención cercana.
          </p>
          <p>
            Nuestro nombre resume lo que buscamos transmitir: agarre, estabilidad y confianza en cada paso, tanto
            en la calle como en la cancha.
          </p>
        </Col>
        <Col md={5}>
          <img src="/assets/img/nosotros-equipo.jpg" alt="Equipo de GRIP ordenando cajas de zapatillas" className="img-fluid" />
        </Col>
      </Row>

      <section className="mt-5" aria-labelledby="video-titulo">
        <h2 id="video-titulo" className="h4">Así se vive GRIP</h2>
        <p>Un vistazo rápido a cómo preparamos cada pedido antes de que llegue a tu puerta.</p>
        <div className="ratio ratio-16x9">
          <video controls poster="/assets/img/video-poster.svg" preload="metadata">
            <source src="/assets/video/nosotros.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </section>

      <section className="mt-5" aria-labelledby="valores-titulo">
        <h2 id="valores-titulo" className="h4">Lo que nos mueve</h2>
        <Row className="g-4">
          {VALORES.map((valor) => (
            <Col md={4} key={valor.titulo}>
              <article className="beneficio">
                <h3 className="h5">{valor.titulo}</h3>
                <p>{valor.texto}</p>
              </article>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  )
}
