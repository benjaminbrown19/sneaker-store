package cl.grip.backend.orden;

import cl.grip.backend.producto.Producto;
import cl.grip.backend.producto.ProductoRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrdenService {
    private static final BigDecimal ENVIO = new BigDecimal("3990");
    private static final BigDecimal ENVIO_GRATIS_DESDE = new BigDecimal("50000");
    private static final BigDecimal CIEN = new BigDecimal("100");

    private final OrdenRepository ordenes;
    private final ProductoRepository productos;

    public OrdenService(OrdenRepository ordenes, ProductoRepository productos) {
        this.ordenes = ordenes;
        this.productos = productos;
    }

    @Transactional(readOnly = true)
    public List<OrdenApi.Respuesta> listar() {
        return ordenes.findAll().stream()
                .sorted(Comparator.comparing(Orden::getFecha).reversed())
                .map(OrdenApi::respuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrdenApi.Respuesta buscar(String id) {
        return OrdenApi.respuesta(ordenes.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada")));
    }

    /**
     * Crea una venta interna. Este método se usa en /ordenes, endpoint protegido
     * para administrador, vendedor o cliente autenticado.
     */
    @Transactional
    public OrdenApi.Respuesta crear(OrdenApi.Crear entrada) {
        return crearInterno(entrada, true);
    }

    /**
     * Crea una compra de tienda pública. Fuerza el canal online y no acepta
     * metadatos de vendedor enviados desde el navegador.
     */
    @Transactional
    public OrdenApi.Respuesta crearCheckout(OrdenApi.Crear entrada) {
        return crearInterno(entrada, false);
    }

    private OrdenApi.Respuesta crearInterno(OrdenApi.Crear entrada, boolean ventaInterna) {
        if (entrada == null || entrada.cliente() == null
                || entrada.items() == null || entrada.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datos de la orden incompletos");
        }

        String nombre = texto(entrada.cliente().nombre());
        if (nombre.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre requerido");
        }

        String apellidos = texto(entrada.cliente().apellidos());
        String correo = textoONull(entrada.cliente().correo());

        String canalSolicitado = ventaInterna
                ? valorPorDefecto(entrada.canal(), "online").toLowerCase(Locale.ROOT)
                : "online";

        if (!"online".equals(canalSolicitado) && !"vendedor".equals(canalSolicitado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Canal de venta inválido");
        }

        OrdenApi.Entrega entregaEntrada = entrada.entrega();
        String tipoEntrega = entregaEntrada == null
                ? "retiro"
                : valorPorDefecto(entregaEntrada.tipo(), "retiro").toLowerCase(Locale.ROOT);

        if (!"retiro".equals(tipoEntrega) && !"domicilio".equals(tipoEntrega)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de entrega inválido");
        }

        String region = entregaEntrada == null ? null : textoONull(entregaEntrada.region());
        String comuna = entregaEntrada == null ? null : textoONull(entregaEntrada.comuna());
        String direccion = entregaEntrada == null ? null : textoONull(entregaEntrada.direccion());

        if ("domicilio".equals(tipoEntrega)
                && (region == null || comuna == null || direccion == null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Para despacho a domicilio debes indicar región, comuna y dirección");
        }

        OrdenApi.Pago pagoEntrada = entrada.pago();
        String metodoPago = pagoEntrada == null
                ? "no_informado"
                : valorPorDefecto(pagoEntrada.metodo(), "no_informado").toLowerCase(Locale.ROOT);

        if (!Set.of("tarjeta", "debito", "credito", "efectivo", "presencial", "no_informado")
                .contains(metodoPago)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Método de pago inválido");
        }

        String ultimos4 = pagoEntrada == null ? null : soloDigitos(pagoEntrada.ultimos4(), 4);
        String codigoAutorizacion = pagoEntrada == null ? null : soloDigitos(pagoEntrada.codigoAutorizacion(), 8);
        Integer cuotas = pagoEntrada == null ? null : pagoEntrada.cuotas();

        if (cuotas != null && (cuotas < 1 || cuotas > 12)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad de cuotas inválida");
        }

        String codigoCupon = textoONull(entrada.cupon());
        if (codigoCupon != null) {
            codigoCupon = codigoCupon.toUpperCase(Locale.ROOT);
        }

        BigDecimal porcentajeCupon = BigDecimal.ZERO;
        if (codigoCupon != null) {
            porcentajeCupon = switch (codigoCupon) {
                case "GRIP10" -> new BigDecimal("0.10");
                case "GRIP20" -> new BigDecimal("0.20");
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón no válido");
            };
        }

        String vendedorNombre = null;
        String vendedorRun = null;
        String vendedorCorreo = null;

        if (ventaInterna && "vendedor".equals(canalSolicitado)) {
            if (entrada.vendedor() == null
                    || textoONull(entrada.vendedor().nombre()) == null
                    || textoONull(entrada.vendedor().correo()) == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Faltan los datos del vendedor que registra la venta");
            }
            vendedorNombre = textoONull(entrada.vendedor().nombre());
            vendedorRun = textoONull(entrada.vendedor().run());
            vendedorCorreo = textoONull(entrada.vendedor().correo());
        }

        String estadoOrden = "no_informado".equals(metodoPago) ? "registrada" : "pagada";
        BigDecimal subtotal = BigDecimal.ZERO;
        Set<String> codigos = new HashSet<>();
        Orden orden = new Orden(
                "ORD-" + UUID.randomUUID(),
                Instant.now(),
                nombre,
                apellidos,
                correo,
                estadoOrden,
                BigDecimal.ZERO,
                canalSolicitado,
                vendedorNombre,
                vendedorRun,
                vendedorCorreo,
                tipoEntrega,
                region,
                comuna,
                direccion,
                metodoPago,
                ultimos4,
                codigoAutorizacion,
                cuotas,
                codigoCupon,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO);

        for (OrdenApi.Linea linea : entrada.items()) {
            if (linea == null || linea.codigo() == null || linea.codigo().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código de producto requerido");
            }

            String codigo = linea.codigo().trim();
            if (!codigos.add(codigo)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Producto duplicado en la orden: " + codigo);
            }

            if (linea.cantidad() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad inválida");
            }

            // Bloqueo de fila para evitar vender simultáneamente más unidades que las disponibles.
            Producto producto = productos.findByCodigoForUpdate(codigo)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Producto inexistente: " + codigo));

            if (producto.getStock() == null || producto.getStock() < linea.cantidad()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para: " + producto.getNombre());
            }

            BigDecimal precioBase = producto.getPrecio();
            int descuentoProducto = producto.getDescuento() == null ? 0 : producto.getDescuento();
            BigDecimal precioUnitario = precioBase
                    .multiply(CIEN.subtract(BigDecimal.valueOf(descuentoProducto)))
                    .divide(CIEN, 0, RoundingMode.HALF_UP);

            ItemOrden item = new ItemOrden(
                    producto.getCodigo(),
                    producto.getNombre(),
                    linea.cantidad(),
                    precioUnitario);

            orden.agregarItem(item);
            subtotal = subtotal.add(item.getSubtotal());

            producto.setStock(producto.getStock() - linea.cantidad());
            productos.saveAndFlush(producto);
        }

        BigDecimal descuento = subtotal.multiply(porcentajeCupon)
                .setScale(0, RoundingMode.HALF_UP);

        BigDecimal costoEnvio = BigDecimal.ZERO;
        if ("domicilio".equals(tipoEntrega) && subtotal.compareTo(ENVIO_GRATIS_DESDE) < 0) {
            costoEnvio = ENVIO;
        }

        BigDecimal total = subtotal.subtract(descuento).add(costoEnvio);

        Orden definitiva = new Orden(
                orden.getId(),
                orden.getFecha(),
                nombre,
                apellidos,
                correo,
                estadoOrden,
                total,
                canalSolicitado,
                vendedorNombre,
                vendedorRun,
                vendedorCorreo,
                tipoEntrega,
                region,
                comuna,
                direccion,
                metodoPago,
                ultimos4,
                codigoAutorizacion,
                cuotas,
                codigoCupon,
                subtotal,
                descuento,
                costoEnvio);

        for (ItemOrden item : orden.getItems()) {
            definitiva.agregarItem(new ItemOrden(
                    item.getCodigo(),
                    item.getNombre(),
                    item.getCantidad(),
                    item.getPrecioUnitario()));
        }

        Orden guardada = ordenes.saveAndFlush(definitiva);
        return OrdenApi.respuesta(guardada);
    }

    private static String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private static String textoONull(String valor) {
        String limpio = texto(valor);
        return limpio.isBlank() ? null : limpio;
    }

    private static String valorPorDefecto(String valor, String defecto) {
        return valor == null || valor.isBlank() ? defecto : valor.trim();
    }

    private static String soloDigitos(String valor, int maximo) {
        if (valor == null) return null;
        String limpio = valor.replaceAll("\\D", "");
        if (limpio.isBlank()) return null;
        return limpio.length() <= maximo ? limpio : limpio.substring(limpio.length() - maximo);
    }
}
