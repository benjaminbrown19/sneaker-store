import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import { useFormulario } from '../../hooks/useFormulario'
import { validarNumero, validarTexto } from '../../utils/validaciones'

export const PRODUCTO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockCritico: '',
  descuento: '0',
  categoria: '',
  imagen: '/assets/img/producto-generico.svg',
}

const reglas = {
  codigo: (valor) => validarTexto(valor, { min: 3, max: 20, nombreCampo: 'El código' }),
  nombre: (valor) => validarTexto(valor, { max: 100, nombreCampo: 'El nombre' }),
  descripcion: (valor) => validarTexto(valor, { obligatorio: false, max: 500, nombreCampo: 'La descripción' }),
  precio: (valor) => validarNumero(valor, { min: 0, nombreCampo: 'El precio' }),
  stock: (valor) => validarNumero(valor, { min: 0, entero: true, nombreCampo: 'El stock' }),
  stockCritico: (valor) =>
    validarNumero(valor, { obligatorio: false, min: 0, entero: true, nombreCampo: 'El stock crítico' }),
  descuento: (valor) => {
    const error = validarNumero(valor, { obligatorio: false, min: 0, entero: true, nombreCampo: 'El descuento' })
    if (error) return error
    return Number(valor) > 90 ? 'El descuento no puede superar el 90%.' : null
  },
  categoria: (valor) => (valor ? null : 'Selecciona una categoría.'),
}

export default function FormularioProducto({
  valoresIniciales = PRODUCTO_VACIO,
  categorias,
  onGuardar,
  onCancelar,
  codigoBloqueado = false,
  textoBoton = 'Guardar producto',
}) {
  const { valores, campo, validarTodo } = useFormulario({ ...PRODUCTO_VACIO, ...valoresIniciales }, reglas)
  const [resultado, setResultado] = useState(null)
  const opcionesCategoria = categorias.map((categoria) => ({ valor: categoria.id, etiqueta: categoria.nombre }))

  function enviar(evento) {
    evento.preventDefault()
    setResultado(null)
    if (!validarTodo()) return

    const respuesta = onGuardar({
      codigo: valores.codigo.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      stockCritico: valores.stockCritico === '' ? 0 : Number(valores.stockCritico),
      descuento: valores.descuento === '' ? 0 : Number(valores.descuento),
      categoria: valores.categoria,
      imagen: valores.imagen.trim() || PRODUCTO_VACIO.imagen,
    })
    setResultado(respuesta)
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de producto">
      {resultado && !resultado.ok && <Mensaje variante="danger">{resultado.error}</Mensaje>}
      <Row>
        <Col md={4}>
          <CampoFormulario {...campo('codigo', 'producto-codigo')} etiqueta="Código" deshabilitado={codigoBloqueado} />
        </Col>
        <Col md={8}>
          <CampoFormulario {...campo('nombre', 'producto-nombre')} etiqueta="Nombre" />
        </Col>
      </Row>
      <CampoFormulario {...campo('descripcion', 'producto-descripcion')} etiqueta="Descripción (opcional)" tipo="textarea" filas={3} />
      <Row>
        <Col sm={6} md={3}>
          <CampoFormulario {...campo('precio', 'producto-precio')} etiqueta="Precio (CLP)" tipo="number" min="0" />
        </Col>
        <Col sm={6} md={3}>
          <CampoFormulario {...campo('stock', 'producto-stock')} etiqueta="Stock" tipo="number" min="0" />
        </Col>
        <Col sm={6} md={3}>
          <CampoFormulario {...campo('stockCritico', 'producto-stock-critico')} etiqueta="Stock crítico" tipo="number" min="0" />
        </Col>
        <Col sm={6} md={3}>
          <CampoFormulario {...campo('descuento', 'producto-descuento')} etiqueta="Descuento (%)" tipo="number" min="0" max="90" />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <CampoFormulario {...campo('categoria', 'producto-categoria')} etiqueta="Categoría" opciones={opcionesCategoria} />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('imagen', 'producto-imagen')} etiqueta="Ruta de la imagen" />
        </Col>
      </Row>
      <div className="d-flex gap-2 flex-wrap">
        <Boton tipo="submit">{textoBoton}</Boton>
        {onCancelar && <Boton variante="secundario" onClick={onCancelar}>Cancelar</Boton>}
      </div>
    </Form>
  )
}
