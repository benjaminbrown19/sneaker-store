import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import ResumenCompra from '../../components/molecules/ResumenCompra'
import FormularioCheckout from '../../components/organisms/FormularioCheckout'
import { useCarrito } from '../../context/CarritoContext'
import { useSesion } from '../../context/SesionContext'
import { usuariosService } from '../../services/usuariosService'
import { productosService } from '../../services/productosService'
import { ordenesService } from '../../services/ordenesService'
import { formatearPrecio } from '../../utils/formato'

export default function Checkout() {
  const navigate = useNavigate()
  const { sesion } = useSesion()
  const { lineas, items, cupon, resumenPara, vaciar } = useCarrito()
  const [tipoEntrega, setTipoEntrega] = useState('domicilio')
  const finalizando = useRef(false)

  if (lineas.length === 0 && !finalizando.current) {
    return <Navigate to="/carrito" replace />
  }

  const usuario = sesion ? usuariosService.buscarPorCorreo(sesion.correo) : null
  const datosIniciales = usuario
    ? {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
      }
    : sesion
      ? { nombre: sesion.nombre, correo: sesion.correo }
      : undefined

  const resumen = resumenPara(tipoEntrega)

  function pagar(valores) {
    finalizando.current = true
    const tarjeta = valores.tarjeta.replace(/\s/g, '')

    if (tarjeta.endsWith('0000')) {
      navigate('/pago-error', { state: { motivo: 'El banco rechazó la tarjeta ingresada.' } })
      return
    }

    const orden = ordenesService.registrar({
      cliente: { nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim() },
      entrega:
        tipoEntrega === 'domicilio'
          ? { tipo: 'domicilio', region: valores.region, comuna: valores.comuna, direccion: valores.direccion.trim() }
          : { tipo: 'retiro' },
      pago: { metodo: 'tarjeta', ultimos4: tarjeta.slice(-4) },
      items: lineas.map((linea) => ({
        codigo: linea.producto.codigo,
        nombre: linea.producto.nombre,
        cantidad: linea.cantidad,
        precioUnitario: linea.precioUnitario,
        subtotal: linea.subtotal,
      })),
      cupon: cupon ? cupon.codigo : null,
      subtotal: resumen.subtotal,
      descuento: resumen.descuento,
      envio: resumen.envio,
      total: resumen.total,
      estado: 'pagada',
    })

    productosService.descontarStock(items)
    vaciar()
    navigate('/pago-exitoso', { state: { ordenId: orden.id } })
  }

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Checkout" subtitulo="Revisa tus datos y completa el pago." />
      <Row className="g-4">
        <Col lg={7}>
          <FormularioCheckout
            valoresIniciales={datosIniciales}
            tipoEntrega={tipoEntrega}
            onCambiarTipoEntrega={setTipoEntrega}
            onPagar={pagar}
          />
        </Col>
        <Col lg={5}>
          <aside className="panel-resumen" aria-label="Resumen del pedido">
            <h2 className="h5">Tu pedido</h2>
            <ul className="lista-pedido">
              {lineas.map((linea) => (
                <li key={linea.producto.codigo}>
                  <span>{linea.cantidad} × {linea.producto.nombre}</span>
                  <span className="dato-mono">{formatearPrecio(linea.subtotal)}</span>
                </li>
              ))}
            </ul>
            <ResumenCompra resumen={resumen} cupon={cupon} />
          </aside>
        </Col>
      </Row>
    </Container>
  )
}
