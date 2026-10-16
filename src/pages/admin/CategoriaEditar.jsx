import { Link, useNavigate, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioCategoria from '../../components/organisms/FormularioCategoria'
import { categoriasService } from '../../services/categoriasService'

export default function CategoriaEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categoria = categoriasService.obtener(id)

  if (!categoria) {
    return (
      <>
        <Mensaje variante="danger">No se encontró la categoría.</Mensaje>
        <Link to="/admin/categorias">Volver a categorías</Link>
      </>
    )
  }

  function guardar(datos) {
    const resultado = categoriasService.actualizar(id, datos)
    if (resultado.ok) navigate('/admin/categorias')
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo={`Editar ${categoria.nombre}`} />
      <FormularioCategoria
        valoresIniciales={{ nombre: categoria.nombre, descripcion: categoria.descripcion }}
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/categorias')}
        textoBoton="Guardar cambios"
      />
    </>
  )
}
