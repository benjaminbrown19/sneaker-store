import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Boton from '../../components/atoms/Boton'
import Mensaje from '../../components/atoms/Mensaje'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import CampoFormulario from '../../components/molecules/CampoFormulario'
import ResumenCompra from '../../components/molecules/ResumenCompra'
import { useSesion } from '../../context/SesionContext'
import { useFormulario } from '../../hooks/useFormulario'
import { ordenesService } from '../../services/ordenesService'
import { productosService } from '../../services/productosService'
import { usuariosService } from '../../services/usuariosService'
import { formatearFecha, formatearPrecio } from '../../utils/formato'
import { validarNumero, validarTexto } from '../../utils/validaciones'

const VENTA_VACIA = {
  nombre: '',
  apellidos: '',
  producto: '',
  cantidad: '1',
  metodoPago: 'efectivo',
  ultimos4: '',
  codigoAutorizacion: '',
  cuotas: '1',
}

const OPCIONES_CUOTAS = [1, 2, 3, 6, 9, 12].map((cuotas) => ({
  valor: String(cuotas),
  etiqueta: cuotas === 1 ? 'Sin cuotas' : `${cuotas} cuotas`,
}))

const reglas = {
  nombre: (valor) => validarTexto(valor, { max: 50, nombreCampo: 'El nombre del cliente' }),
  apellidos: (valor) => validarTexto(valor, { max: 100, nombreCampo: 'Los apellidos del cliente' }),
  ultimos4: (valor, todos) => {
    if (todos.metodoPago === 'efectivo') return null
    return /^[0-9]{4}$/.test((valor || '').trim()) ? null : 'Ingresa los 4 últimos dígitos de la tarjeta.'
  },
  codigoAutorizacion: (valor, todos) => {
    if (todos.metodoPago === 'efectivo') return null
    return /^[0-9]{4,8}$/.test((valor || '').trim())
      ? null
      : 'El código de autorización debe tener entre 4 y 8 dígitos.'
  },
}

export default function VentaTienda() {
  const { sesion } = useSesion()
  const { valores, campo, cambiar, validarTodo, reiniciar } = useFormulario(VENTA_VACIA, reglas)
  const [lineas, setLineas] = useState([])
  const [aviso, setAviso] = useState(null)
  const [comprobante, setComprobante] = useState(null)

  const vendedor = usuariosService.buscarPorCorreo(sesion.correo)
  const opcionesProducto = productosService
    .listar()
    .filter((producto) => producto.stock > 0)
    .map((producto) => ({
      valor: producto.codigo,
      etiqueta: `${producto.nombre} (${producto.stock} disponibles)`,
    }))

  const total = lineas.reduce((suma, linea) => suma + linea.precioUnitario * linea.cantidad, 0)

  if (!vendedor) {
    return (
      <>
        <TituloSeccion titulo="Venta en tienda" />
        <Mensaje variante="danger">Tu sesión no está asociada a una cuenta de vendedor registrada.</Mensaje>
      </>
    )
  }

  function agregarProducto() {
    setAviso(null)
    const producto = productosService.obtener(valores.producto)
    const errorCantidad = validarNumero(valores.cantidad, { min: 1, entero: true, nombreCampo: 'La cantidad' })

    if (!producto) {
      setAviso({ variante: 'danger', texto: 'Selecciona un producto.' })
      return
    }
    if (errorCantidad) {
      setAviso({ variante: 'danger', texto: errorCantidad })
      return
    }

    const cantidad = Number(valores.cantidad)
    const yaEnVenta = lineas.find((linea) => linea.codigo === producto.codigo)?.cantidad ?? 0
    if (yaEnVenta + cantidad > producto.stock) {
      setAviso({
        variante: 'danger',
        texto: `Solo quedan ${producto.stock - yaEnVenta} unidades de ${producto.nombre}.`,
      })
      return
    }

    const precioUnitario = productosService.precioFinal(producto)
    const existe = lineas.some((linea) => linea.codigo === producto.codigo)
    setLineas(
      existe
        ? lineas.map((linea) =>
            linea.codigo === producto.codigo ? { ...linea, cantidad: linea.cantidad + cantidad } : linea,
          )
        : [...lineas, { codigo: producto.codigo, nombre: producto.nombre, precioUnitario, cantidad }],
    )
    reiniciar({ ...valores, producto: '', cantidad: '1' })
  }

  function quitarLinea(codigo) {
    setLineas(lineas.filter((linea) => linea.codigo !== codigo))
  }

  function registrarVenta(evento) {
    evento.preventDefault()
    setAviso(null)
    setComprobante(null)
    if (!validarTodo()) return
    if (lineas.length === 0) {
      setAviso({ variante: 'danger', texto: 'Agrega al menos un producto a la venta.' })
      return
    }

    const items = lineas.map((linea) => ({
      codigo: linea.codigo,
      nombre: linea.nombre,
      cantidad: linea.cantidad,
      precioUnitario: linea.precioUnitario,
      subtotal: linea.precioUnitario * linea.cantidad,
    }))
    const nombreCliente = valores.nombre.trim()
    const apellidosCliente = valores.apellidos.trim()
    const metodoPago = valores.metodoPago

    const pago =
      metodoPago === 'efectivo'
        ? { metodo: 'efectivo' }
        : {
            metodo: metodoPago,
            ultimos4: valores.ultimos4.trim(),
            codigoAutorizacion: valores.codigoAutorizacion.trim(),
            ...(metodoPago === 'credito' ? { cuotas: Number(valores.cuotas) } : {}),
          }

    const orden = ordenesService.registrar({
      canal: 'vendedor',
      vendedor: {
        nombre: `${vendedor.nombre} ${vendedor.apellidos}`,
        run: vendedor.run,
        correo: vendedor.correo,
      },
      cliente: { nombre: nombreCliente, apellidos: apellidosCliente, correo: null },
      entrega: { tipo: 'retiro' },
      pago,
      items,
      cupon: null,
      subtotal: total,
      descuento: 0,
      envio: 0,
      total,
      estado: 'pagada',
    })

    productosService.descontarStock(items)
    setLineas([])
    reiniciar()
    if (metodoPago !== 'efectivo') setComprobante(orden)
    setAviso({ variante: 'success', texto: `Venta ${orden.id} registrada para ${nombreCliente} ${apellidosCliente}.` })
  }

  return (
    <>
      <TituloSeccion titulo="Venta en tienda" subtitulo="Registra una compra hecha en tienda para un cliente." />
      <p className="text-muted">
        Vendedor: {vendedor.nombre} {vendedor.apellidos} · RUT {vendedor.run}
      </p>
      {aviso && <Mensaje variante={aviso.variante}>{aviso.texto}</Mensaje>}

      {comprobante && (
        <Card as="section" className="mb-4" aria-label="Comprobante de pago con tarjeta">
          <Card.Body>
            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
              <h2 className="h5 mb-0">Comprobante de pago con tarjeta</h2>
              <Boton variante="secundario" tamano="sm" onClick={() => setComprobante(null)}>
                Cerrar comprobante
              </Boton>
            </div>
            <dl className="boleta-datos mb-0">
              <dt>Orden</dt>
              <dd className="dato-mono">{comprobante.id}</dd>
              <dt>Hora</dt>
              <dd>{formatearFecha(comprobante.fecha)}</dd>
              <dt>Cliente</dt>
              <dd>{comprobante.cliente.nombre} {comprobante.cliente.apellidos}</dd>
              <dt>Tipo de tarjeta</dt>
              <dd>
                {comprobante.pago.metodo === 'debito'
                  ? 'Débito'
                  : `Crédito, ${comprobante.pago.cuotas === 1 ? 'sin cuotas' : `${comprobante.pago.cuotas} cuotas`}`}
              </dd>
              <dt>Últimos 4 dígitos</dt>
              <dd className="dato-mono">**** {comprobante.pago.ultimos4}</dd>
              <dt>Código de autorización</dt>
              <dd className="dato-mono">{comprobante.pago.codigoAutorizacion}</dd>
              <dt>Monto pagado</dt>
              <dd className="dato-mono">{formatearPrecio(comprobante.total)}</dd>
            </dl>
          </Card.Body>
        </Card>
      )}

      <Form onSubmit={registrarVenta} noValidate aria-label="Formulario de venta en tienda">
        <Row className="g-4">
          <Col lg={7}>
            <h2 className="h5">Datos del cliente</h2>
            <Row>
              <Col md={6}>
                <CampoFormulario {...campo('nombre', 'venta-nombre')} etiqueta="Nombre del cliente" />
              </Col>
              <Col md={6}>
                <CampoFormulario {...campo('apellidos', 'venta-apellidos')} etiqueta="Apellidos del cliente" />
              </Col>
            </Row>

            <h2 className="h5 mt-4">Productos</h2>
            <Row className="align-items-end">
              <Col md={7}>
                <CampoFormulario
                  id="venta-producto"
                  etiqueta="Producto"
                  opciones={opcionesProducto}
                  valor={valores.producto}
                  onChange={(evento) => cambiar('producto', evento.target.value)}
                  placeholder="Selecciona un producto"
                />
              </Col>
              <Col md={3}>
                <CampoFormulario
                  id="venta-cantidad"
                  etiqueta="Cantidad"
                  tipo="number"
                  min={1}
                  valor={valores.cantidad}
                  onChange={(evento) => cambiar('cantidad', evento.target.value)}
                />
              </Col>
              <Col md={2}>
                <Boton variante="secundario" className="w-100 mb-3" onClick={agregarProducto}>
                  Agregar
                </Boton>
              </Col>
            </Row>

            <h2 className="h5 mt-4">Forma de pago</h2>
            <div className="mb-3" role="radiogroup" aria-label="Forma de pago">
              <Form.Check
                type="radio"
                id="pago-efectivo"
                name="metodoPago"
                label="Efectivo"
                checked={valores.metodoPago === 'efectivo'}
                onChange={() => cambiar('metodoPago', 'efectivo')}
              />
              <Form.Check
                type="radio"
                id="pago-debito"
                name="metodoPago"
                label="Débito"
                checked={valores.metodoPago === 'debito'}
                onChange={() => cambiar('metodoPago', 'debito')}
              />
              <Form.Check
                type="radio"
                id="pago-credito"
                name="metodoPago"
                label="Crédito"
                checked={valores.metodoPago === 'credito'}
                onChange={() => cambiar('metodoPago', 'credito')}
              />
            </div>

            {valores.metodoPago !== 'efectivo' && (
              <Row>
                <Col md={6}>
                  <CampoFormulario
                    {...campo('ultimos4', 'venta-ultimos4')}
                    etiqueta="Últimos 4 dígitos de la tarjeta"
                    inputMode="numeric"
                    maxLength={4}
                  />
                </Col>
                <Col md={6}>
                  <CampoFormulario
                    {...campo('codigoAutorizacion', 'venta-autorizacion')}
                    etiqueta="Código de autorización"
                    inputMode="numeric"
                    maxLength={8}
                    ayuda="Código que entrega el POS al aprobar la compra."
                  />
                </Col>
              </Row>
            )}

            {valores.metodoPago === 'credito' && (
              <CampoFormulario
                id="venta-cuotas"
                etiqueta="Cuotas"
                opciones={OPCIONES_CUOTAS}
                valor={valores.cuotas}
                onChange={(evento) => cambiar('cuotas', evento.target.value)}
              />
            )}
          </Col>

          <Col lg={5}>
            <aside className="panel-resumen" aria-label="Resumen de la venta">
              <h2 className="h5">Detalle de la venta</h2>
              {lineas.length === 0 ? (
                <Mensaje variante="light">Todavía no hay productos en la venta.</Mensaje>
              ) : (
                <Table size="sm" className="align-middle">
                  <caption className="visually-hidden">Productos de la venta</caption>
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col" className="text-end">Cant.</th>
                      <th scope="col" className="text-end">Subtotal</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineas.map((linea) => (
                      <tr key={linea.codigo}>
                        <td>{linea.nombre}</td>
                        <td className="text-end dato-mono">{linea.cantidad}</td>
                        <td className="text-end dato-mono">{formatearPrecio(linea.precioUnitario * linea.cantidad)}</td>
                        <td>
                          <Boton variante="peligro" tamano="sm" onClick={() => quitarLinea(linea.codigo)}>
                            Quitar
                          </Boton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <ResumenCompra resumen={{ subtotal: total, descuento: 0, envio: 0, total }} cupon={null} />
              <Boton tipo="submit" tamano="lg" className="w-100 mt-3">
                Registrar venta
              </Boton>
            </aside>
          </Col>
        </Row>
      </Form>
    </>
  )
}
