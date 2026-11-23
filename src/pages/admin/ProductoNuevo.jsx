import { useNavigate } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioProducto from '../../components/organisms/FormularioProducto'
import { productosApi } from '../../services/productosApi'
import { categoriasService } from '../../services/categoriasService'

export default function ProductoNuevo() {
  const navigate = useNavigate()

  async function guardar(datos) {
    try { await productosApi.crear(datos); navigate('/admin/productos'); return { ok: true } }
    catch (e) { return { ok: false, error: e.message } }
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
