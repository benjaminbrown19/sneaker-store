import { Link, useNavigate, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioProducto from '../../components/organisms/FormularioProducto'
import { productosService } from '../../services/productosService'
import { categoriasService } from '../../services/categoriasService'

export default function ProductoEditar() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const producto = productosService.obtener(codigo)

  if (!producto) {
    return (
      <>
        <Mensaje variante="danger">No se encontró el producto.</Mensaje>
        <Link to="/admin/productos">Volver a productos</Link>
      </>
    )
  }

  function guardar(datos) {
    const resultado = productosService.actualizar(codigo, datos)
    if (resultado.ok) navigate('/admin/productos')
    return resultado
  }

  const valoresIniciales = {
    ...producto,
    precio: String(producto.precio),
    stock: String(producto.stock),
    stockCritico: String(producto.stockCritico ?? ''),
    descuento: String(producto.descuento ?? 0),
  }

  return (
    <>
      <TituloSeccion titulo={`Editar ${producto.nombre}`} />
      <FormularioProducto
        valoresIniciales={valoresIniciales}
        categorias={categoriasService.listar()}
        codigoBloqueado
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/productos')}
        textoBoton="Guardar cambios"
      />
    </>
  )
}
