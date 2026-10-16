import { useNavigate } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioProducto from '../../components/organisms/FormularioProducto'
import { productosService } from '../../services/productosService'
import { categoriasService } from '../../services/categoriasService'

export default function ProductoNuevo() {
  const navigate = useNavigate()

  function guardar(datos) {
    const resultado = productosService.crear(datos)
    if (resultado.ok) navigate('/admin/productos')
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo="Nuevo producto" />
      <FormularioProducto
        categorias={categoriasService.listar()}
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/productos')}
        textoBoton="Crear producto"
      />
    </>
  )
}
