import { useNavigate } from 'react-router-dom'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioCategoria from '../../components/organisms/FormularioCategoria'
import { categoriasService, generarIdCategoria } from '../../services/categoriasService'

export default function CategoriaNueva() {
  const navigate = useNavigate()

  function guardar(datos) {
    const resultado = categoriasService.crear({ id: generarIdCategoria(datos.nombre), ...datos })
    if (resultado.ok) navigate('/admin/categorias')
    return resultado
  }

  return (
    <>
      <TituloSeccion titulo="Nueva categoría" />
      <FormularioCategoria
        onGuardar={guardar}
        onCancelar={() => navigate('/admin/categorias')}
        textoBoton="Crear categoría"
      />
    </>
  )
}
