import { render, screen } from '@testing-library/react'
import ResumenCompra from '../components/molecules/ResumenCompra'

describe('ResumenCompra', () => {
  it('muestra subtotal, envío gratis y total sin la fila de descuento', () => {
    render(<ResumenCompra resumen={{ subtotal: 60000, descuento: 0, envio: 0, total: 60000 }} />)

    expect(screen.getByTestId('resumen-subtotal')).toHaveTextContent('$60.000')
    expect(screen.getByTestId('resumen-envio')).toHaveTextContent('Gratis')
    expect(screen.getByTestId('resumen-total')).toHaveTextContent('$60.000')
    expect(screen.queryByTestId('resumen-descuento')).not.toBeInTheDocument()
  })

  it('muestra el cupón y el descuento cuando existe, y el costo de envío', () => {
    render(
      <ResumenCompra
        resumen={{ subtotal: 30000, descuento: 3000, envio: 3990, total: 30990 }}
        cupon={{ codigo: 'GRIP10' }}
      />,
    )

    expect(screen.getByText('Cupón GRIP10')).toBeInTheDocument()
    expect(screen.getByTestId('resumen-descuento')).toHaveTextContent('-$3.000')
    expect(screen.getByTestId('resumen-envio')).toHaveTextContent('$3.990')
    expect(screen.getByTestId('resumen-total')).toHaveTextContent('$30.990')
  })
})
