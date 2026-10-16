import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import ListaProductos from '../../components/organisms/ListaProductos'
import { productosService } from '../../services/productosService'
import { useAvisoCarrito } from '../../hooks/useAvisoCarrito'

const BENEFICIOS = [
  { icono: '/assets/icons/icono-envio.svg', titulo: 'Envío a todo Chile', texto: 'Despacho a domicilio en 24-72 horas hábiles según tu región.' },
  { icono: '/assets/icons/icono-cambio.svg', titulo: 'Cambios sin drama', texto: '30 días para cambiar tu par si el calce no es el correcto.' },
  { icono: '/assets/icons/icono-original.svg', titulo: '100% originales', texto: 'Trabajamos solo con distribuidores autorizados.' },
]

export default function Inicio() {
  const { aviso, agregarConAviso } = useAvisoCarrito()
  const destacados = productosService.listar().slice(0, 4)

  return (
    <>
      <section className="hero-grip" aria-label="Presentación de la tienda">
        <Container>
          <Row className="align-items-center gy-4">
            <Col md={7}>
              <h1>Pisa fuerte. <span className="acento">Pisa GRIP.</span></h1>
              <p className="lead">
                Zapatillas urbanas y deportivas seleccionadas para quienes no caminan, se mueven.
                Nueva colección disponible con envío a todo Chile.
              </p>
              <Link to="/productos" className="btn btn-warning btn-lg boton-grip">Ver colección</Link>
            </Col>
            <Col md={5}>
              <img
                src="/assets/img/hero-sneaker.jpg"
                alt="Zapatilla GRIP sobre la vereda de una calle urbana de noche"
                className="img-fluid hero-imagen"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="beneficios-grip" aria-label="Por qué comprar en GRIP">
        <Container>
          <Row className="g-4">
            {BENEFICIOS.map((beneficio) => (
              <Col md={4} key={beneficio.titulo}>
                <article className="beneficio">
                  <img src={beneficio.icono} alt="" width="40" height="40" />
                  <h2 className="h5">{beneficio.titulo}</h2>
                  <p>{beneficio.texto}</p>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="seccion-grip">
        <Container>
          <TituloSeccion titulo="Productos destacados" subtitulo="Una selección de lo que más se mueve en GRIP." nivel={2} />
          {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}
          <ListaProductos productos={destacados} onAgregar={agregarConAviso} />
          <p className="mt-4 mb-0">
            <Link to="/productos">Ver todos los productos →</Link>
          </p>
        </Container>
      </section>
    </>
  )
}
