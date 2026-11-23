package cl.grip.backend.orden;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OrdenApi {
    private OrdenApi() {}

    public record Cliente(
            @NotBlank String nombre,
            String apellidos,
            @Email String correo) {}

    public record Linea(
            @NotBlank String codigo,
            @Min(1) int cantidad) {}

    public record Entrega(
            String tipo,
            String region,
            String comuna,
            String direccion) {}

    public record Pago(
            String metodo,
            String ultimos4,
            String codigoAutorizacion,
            Integer cuotas) {}

    public record Vendedor(
            String nombre,
            String run,
            String correo) {}

    public record Crear(
            @NotNull @Valid Cliente cliente,
            @NotEmpty List<@Valid Linea> items,
            String canal,
            @Valid Entrega entrega,
            @Valid Pago pago,
            @Valid Vendedor vendedor,
            String cupon) {}

    public record Item(
            String codigo,
            String nombre,
            int cantidad,
            BigDecimal precioUnitario,
            BigDecimal subtotal) {}

    public record Respuesta(
            String id,
            Instant fecha,
            Cliente cliente,
            List<Item> items,
            BigDecimal subtotal,
            BigDecimal descuento,
            BigDecimal envio,
            BigDecimal total,
            String estado,
            String canal,
            Vendedor vendedor,
            Entrega entrega,
            Pago pago,
            String cupon) {}

    public static Respuesta respuesta(Orden orden) {
        BigDecimal total = ceroSiNulo(orden.getTotal());
        BigDecimal subtotal = orden.getSubtotal() == null ? total : orden.getSubtotal();

        Vendedor vendedor = null;
        if (orden.getVendedorNombre() != null
                || orden.getVendedorRun() != null
                || orden.getVendedorCorreo() != null) {
            vendedor = new Vendedor(
                    orden.getVendedorNombre(),
                    orden.getVendedorRun(),
                    orden.getVendedorCorreo());
        }

        Entrega entrega = new Entrega(
                valorPorDefecto(orden.getEntregaTipo(), "retiro"),
                orden.getEntregaRegion(),
                orden.getEntregaComuna(),
                orden.getEntregaDireccion());

        Pago pago = new Pago(
                valorPorDefecto(orden.getPagoMetodo(), "no_informado"),
                orden.getPagoUltimos4(),
                orden.getPagoCodigoAutorizacion(),
                orden.getPagoCuotas());

        List<Item> items = orden.getItems().stream()
                .map(i -> new Item(
                        i.getCodigo(),
                        i.getNombre(),
                        i.getCantidad(),
                        i.getPrecioUnitario(),
                        i.getSubtotal()))
                .toList();

        return new Respuesta(
                orden.getId(),
                orden.getFecha(),
                new Cliente(
                        orden.getClienteNombre(),
                        orden.getClienteApellidos(),
                        orden.getClienteCorreo()),
                items,
                subtotal,
                ceroSiNulo(orden.getDescuento()),
                ceroSiNulo(orden.getEnvio()),
                total,
                valorPorDefecto(orden.getEstado(), "registrada"),
                valorPorDefecto(orden.getCanal(), "online"),
                vendedor,
                entrega,
                pago,
                orden.getCupon());
    }

    private static BigDecimal ceroSiNulo(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }

    private static String valorPorDefecto(String valor, String defecto) {
        return valor == null || valor.isBlank() ? defecto : valor;
    }
}
