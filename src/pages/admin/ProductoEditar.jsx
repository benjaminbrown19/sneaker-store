import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import FormularioProducto from '../../components/organisms/FormularioProducto'
import { productosApi } from '../../services/productosApi'
import { categoriasService } from '../../services/categoriasService'
export default function ProductoEditar() {
  const { codigo } = useParams(); const navigate = useNavigate()
  const [producto, setProducto] = useState(null); const [error, setError] = useState('')
  useEffect(()=>{let vivo=true; productosApi.obtener(codigo).then(p=> {if(vivo)setProducto(p)}).catch(e=>{if(vivo)setError(e.message)});return()=>{vivo=false}},[codigo])
  async function guardar(datos) {
    try { await productosApi.actualizar(codigo, datos); navigate('/admin/productos'); return {ok:true} }
    catch(e){return {ok:false,error:e.message}}
  }
  if(error) return <><Mensaje variante="danger">{error}</Mensaje><Link to="/admin/productos">Volver</Link></>
  if(!producto) return <p>Cargando producto...</p>
  const valoresIniciales = { ...producto,precio:String(producto.precio),stock:String(producto.stock),stockCritico:String(producto.stockCritico ?? ''),descuento:String(producto.descuento ?? 0) }
  return <><TituloSeccion titulo={`Editar ${producto.nombre}`} />
    <FormularioProducto valoresIniciales={valoresIniciales} categorias={categoriasService.listar()} codigoBloqueado onGuardar={guardar} onCancelar={()=>navigate('/admin/productos')} textoBoton="Guardar cambios" />
  </>
}
