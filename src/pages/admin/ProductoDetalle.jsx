import { Link, useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Insignia from '../../components/atoms/Insignia'
import Mensaje from '../../components/atoms/Mensaje'
import Precio from '../../components/atoms/Precio'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import { useSesion } from '../../context/SesionContext'
import { productosService } from '../../services/productosService'
import { capitalizar } from '../../utils/formato'

export default function ProductoDetalle() {
  const { codigo } = useParams()
  const { sesion } = useSesion()
  const producto = productosService.obtener(codigo)

  if (!producto) {
    return (
      <>
        <Mensaje variante="danger">No se encontró el producto.</Mensaje>
        <Link to="/admin/productos">Volver a productos</Link>
      </>
    )
  }

  const critico = producto.stock <= producto.stockCritico

  return (
    <>
      <TituloSeccion titulo={producto.nombre} subtitulo={producto.codigo} />
      <Row className="g-4">
        <Col md={4}>
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid" />
        </Col>
        <Col md={8}>
          <dl className="ficha-datos">
            <dt>Categoría</dt>
            <dd>{capitalizar(producto.categoria)}</dd>
            <dt>Precio</dt>
            <dd><Precio precio={producto.precio} descuento={producto.descuento} /></dd>
            <dt>Stock</dt>
            <dd>{producto.stock} {critico && <Insignia tono="critico">Crítico</Insignia>}</dd>
            <dt>Stock crítico</dt>
            <dd>{producto.stockCritico}</dd>
            <dt>Descripción</dt>
            <dd>{producto.descripcion || 'Sin descripción'}</dd>
          </dl>
          <div className="d-flex gap-2 flex-wrap">
            {sesion.rol === 'administrador' && (
              <Link to={`/admin/productos/${producto.codigo}/editar`} className="btn btn-warning boton-grip">Editar producto</Link>
            )}
            <Link to="/admin/productos" className="btn btn-outline-dark boton-grip">Volver</Link>
          </div>
        </Col>
      </Row>
    </>
  )
}
