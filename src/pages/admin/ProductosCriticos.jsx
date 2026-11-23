
import { useEffect, useState } from 'react'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import TablaProductos from '../../components/organisms/TablaProductos'
import Mensaje from '../../components/atoms/Mensaje'
import { useSesion } from '../../context/SesionContext'
import { productosApi } from '../../services/productosApi'

export default function ProductosCriticos() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'administrador'

  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let vivo = true

    productosApi.listar()
      .then(datos => {
        if (vivo) setProductos(datos)
      })
      .catch(e => {
        if (vivo) setError(e.message)
      })

    return () => {
      vivo = false
    }
  }, [])

  async function eliminar(codigo) {
    if (!esAdmin || !window.confirm(`¿Eliminar el producto ${codigo}?`)) {
      return
    }

    try {
      await productosApi.eliminar(codigo)

      setProductos(prev =>
        prev.filter(producto => producto.codigo !== codigo)
      )

      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  const productosCriticos = productos.filter(
    producto => producto.stock <= producto.stockCritico
  )

  return (
    <>
      <TituloSeccion
        titulo="Productos críticos"
        subtitulo="Productos cuyo stock está en el nivel crítico o por debajo."
      />

      {error && (
        <Mensaje variante="danger">
          {error}
        </Mensaje>
      )}

      <TablaProductos
        productos={productosCriticos}
        puedeEditar={esAdmin}
        onEliminar={eliminar}
      />
    </>
  )
}
