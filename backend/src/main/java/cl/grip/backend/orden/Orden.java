package cl.grip.backend.orden;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
public class Orden {
    @Id
    @Column(length = 50, nullable = false)
    private String id;

    @Column(nullable = false)
    private Instant fecha;

    @Column(nullable = false, length = 120)
    private String clienteNombre;

    @Column(length = 120)
    private String clienteApellidos;

    @Column(length = 150)
    private String clienteCorreo;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    // Metadatos de venta. Se permiten nulos para conservar las órdenes antiguas.
    @Column(length = 20)
    private String canal;

    @Column(length = 120)
    private String vendedorNombre;

    @Column(length = 20)
    private String vendedorRun;

    @Column(length = 150)
    private String vendedorCorreo;

    @Column(length = 20)
    private String entregaTipo;

    @Column(length = 80)
    private String entregaRegion;

    @Column(length = 80)
    private String entregaComuna;

    @Column(length = 300)
    private String entregaDireccion;

    @Column(length = 20)
    private String pagoMetodo;

    @Column(length = 4)
    private String pagoUltimos4;

    @Column(length = 8)
    private String pagoCodigoAutorizacion;

    private Integer pagoCuotas;

    @Column(length = 20)
    private String cupon;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal descuento;

    @Column(precision = 12, scale = 2)
    private BigDecimal envio;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemOrden> items = new ArrayList<>();

    protected Orden() {}

    public Orden(
            String id,
            Instant fecha,
            String nombre,
            String apellidos,
            String correo,
            String estado,
            BigDecimal total,
            String canal,
            String vendedorNombre,
            String vendedorRun,
            String vendedorCorreo,
            String entregaTipo,
            String entregaRegion,
            String entregaComuna,
            String entregaDireccion,
            String pagoMetodo,
            String pagoUltimos4,
            String pagoCodigoAutorizacion,
            Integer pagoCuotas,
            String cupon,
            BigDecimal subtotal,
            BigDecimal descuento,
            BigDecimal envio) {
        this.id = id;
        this.fecha = fecha;
        this.clienteNombre = nombre;
        this.clienteApellidos = apellidos;
        this.clienteCorreo = correo;
        this.estado = estado;
        this.total = total;
        this.canal = canal;
        this.vendedorNombre = vendedorNombre;
        this.vendedorRun = vendedorRun;
        this.vendedorCorreo = vendedorCorreo;
        this.entregaTipo = entregaTipo;
        this.entregaRegion = entregaRegion;
        this.entregaComuna = entregaComuna;
        this.entregaDireccion = entregaDireccion;
        this.pagoMetodo = pagoMetodo;
        this.pagoUltimos4 = pagoUltimos4;
        this.pagoCodigoAutorizacion = pagoCodigoAutorizacion;
        this.pagoCuotas = pagoCuotas;
        this.cupon = cupon;
        this.subtotal = subtotal;
        this.descuento = descuento;
        this.envio = envio;
    }

    public void agregarItem(ItemOrden item) {
        items.add(item);
        item.setOrden(this);
    }

    public String getId() { return id; }
    public Instant getFecha() { return fecha; }
    public String getClienteNombre() { return clienteNombre; }
    public String getClienteApellidos() { return clienteApellidos; }
    public String getClienteCorreo() { return clienteCorreo; }
    public String getEstado() { return estado; }
    public BigDecimal getTotal() { return total; }
    public String getCanal() { return canal; }
    public String getVendedorNombre() { return vendedorNombre; }
    public String getVendedorRun() { return vendedorRun; }
    public String getVendedorCorreo() { return vendedorCorreo; }
    public String getEntregaTipo() { return entregaTipo; }
    public String getEntregaRegion() { return entregaRegion; }
    public String getEntregaComuna() { return entregaComuna; }
    public String getEntregaDireccion() { return entregaDireccion; }
    public String getPagoMetodo() { return pagoMetodo; }
    public String getPagoUltimos4() { return pagoUltimos4; }
    public String getPagoCodigoAutorizacion() { return pagoCodigoAutorizacion; }
    public Integer getPagoCuotas() { return pagoCuotas; }
    public String getCupon() { return cupon; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getDescuento() { return descuento; }
    public BigDecimal getEnvio() { return envio; }
    public List<ItemOrden> getItems() { return items; }
}
