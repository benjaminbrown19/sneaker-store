import Boton from '../atoms/Boton'

export default function FiltroCategorias({ categorias, seleccionada, onSeleccionar }) {
  const todas = [{ id: '', nombre: 'Todas' }, ...categorias]

  return (
    <div className="filtro-categorias" role="group" aria-label="Filtrar por categoría">
      {todas.map((categoria) => (
        <Boton
          key={categoria.id || 'todas'}
          variante={seleccionada === categoria.id ? 'oscuro' : 'secundario'}
          tamano="sm"
          aria-pressed={seleccionada === categoria.id}
          onClick={() => onSeleccionar(categoria.id)}
        >
          {categoria.nombre}
        </Boton>
      ))}
    </div>
  )
}
