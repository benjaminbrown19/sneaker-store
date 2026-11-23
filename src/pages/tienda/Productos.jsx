import { useEffect, useMemo, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import Buscador from '../../components/molecules/Buscador'
import FiltroCategorias from '../../components/molecules/FiltroCategorias'
import ListaProductos from '../../components/organisms/ListaProductos'
import { productosApi } from '../../services/productosApi'
import { categoriasService } from '../../services/categoriasService'
import { useAvisoCarrito } from '../../hooks/useAvisoCarrito'
import { precioFinal } from '../../utils/formato'

export default function Productos() {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('')
  const [productos, setProductos] = useState([])
  const [errorApi, setErrorApi] = useState('')
  useEffect(() => { let activo = true; productosApi.listar().then(datos => { if(activo) setProductos(datos) }).catch(e=> {if(activo) setErrorApi(e.message)}); return () => {activo=false} }, [])
  const { aviso, agregarConAviso } = useAvisoCarrito()

  const categorias = categoriasService.listar()

  const visibles = useMemo(() => {
    let resultado = productos.filter(p => `${p.nombre} ${p.descripcion || ''}`.toLowerCase().includes(texto.trim().toLowerCase()))
    if (categoria) resultado = resultado.filter((producto) => producto.categoria === categoria)
    if (orden === 'menor') resultado = [...resultado].sort((a, b) => precioFinal(a) - precioFinal(b))
    if (orden === 'mayor') resultado = [...resultado].sort((a, b) => precioFinal(b) - precioFinal(a))
    return resultado
  }, [texto, categoria, orden, productos])

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Productos" subtitulo="Encuentra tu próximo par." />
      <Row className="g-3 align-items-center mb-4">
        <Col md={5}>
          <Buscador valor={texto} onChange={setTexto} />
        </Col>
        <Col md={4}>
          <Form.Select aria-label="Ordenar por precio" value={orden} onChange={(evento) => setOrden(evento.target.value)}>
            <option value="">Orden por defecto</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </Form.Select>
        </Col>
        <Col xs={12}>
          <FiltroCategorias categorias={categorias} seleccionada={categoria} onSeleccionar={setCategoria} />
        </Col>
      </Row>
      {errorApi && <Mensaje variante="danger">{errorApi}</Mensaje>}
      {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}
      <p className="text-muted" aria-live="polite">{visibles.length} productos</p>
      <ListaProductos
        productos={visibles}
        onAgregar={agregarConAviso}
        mensajeVacio="No encontramos productos con esos filtros."
      />
    </Container>
  )
}
