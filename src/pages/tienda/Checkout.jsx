import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TituloSeccion from '../../components/atoms/TituloSeccion'
import Mensaje from '../../components/atoms/Mensaje'
import ResumenCompra from '../../components/molecules/ResumenCompra'
import FormularioCheckout from '../../components/organisms/FormularioCheckout'
import { useCarrito } from '../../context/CarritoContext'
import { useSesion } from '../../context/SesionContext'
import { usuariosService } from '../../services/usuariosService'
import { ordenesApi } from '../../services/ordenesApi'
import { formatearPrecio } from '../../utils/formato'

export default function Checkout() {
  const navigate = useNavigate()
  const { sesion } = useSesion()
  const { lineas, cupon, resumenPara, vaciar, refrescarCatalogo } = useCarrito()
  const [tipoEntrega, setTipoEntrega] = useState('domicilio')
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const finalizando = useRef(false)

  useEffect(() => {
    refrescarCatalogo().catch(() => {
      // Se conserva el catálogo local si el backend no está disponible.
    })
  }, [refrescarCatalogo])

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

  async function pagar(valores) {
    if (finalizando.current || procesando) return

    setError('')
    finalizando.current = true
    const tarjeta = valores.tarjeta.replace(/\s/g, '')

    if (tarjeta.endsWith('0000')) {
      finalizando.current = false
      navigate('/pago-error', { state: { motivo: 'El banco rechazó la tarjeta ingresada.' } })
      return
    }

    setProcesando(true)

    try {
      const orden = await ordenesApi.crear({
        canal: 'online',
        cliente: {
          nombre: valores.nombre.trim(),
          apellidos: valores.apellidos.trim(),
          correo: valores.correo.trim(),
        },
        entrega: tipoEntrega === 'domicilio'
          ? {
              tipo: 'domicilio',
              region: valores.region,
              comuna: valores.comuna,
              direccion: valores.direccion.trim(),
            }
          : { tipo: 'retiro' },
        pago: { metodo: 'tarjeta', ultimos4: tarjeta.slice(-4) },
        cupon: cupon ? cupon.codigo : null,
        items: lineas.map((linea) => ({
          codigo: linea.producto.codigo,
          cantidad: linea.cantidad,
        })),
      })

      // El backend ya descontó el inventario. Solo refrescamos el catálogo local.
      await refrescarCatalogo().catch(() => null)
      vaciar()
      navigate('/pago-exitoso', { state: { orden } })
    } catch (solicitudError) {
      finalizando.current = false
      setProcesando(false)
      setError(solicitudError.message || 'No se pudo registrar la compra. Inténtalo nuevamente.')
    }
  }

  return (
    <Container className="seccion-grip">
      <TituloSeccion titulo="Checkout" subtitulo="Revisa tus datos y completa el pago." />
      {error && <Mensaje variante="danger">{error}</Mensaje>}
      <Row className="g-4">
        <Col lg={7}>
          <FormularioCheckout
            valoresIniciales={datosIniciales}
            tipoEntrega={tipoEntrega}
            onCambiarTipoEntrega={setTipoEntrega}
            onPagar={pagar}
            procesando={procesando}
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
