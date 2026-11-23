package cl.grip.backend.orden;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "orden_items")
public class ItemOrden {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;
    @Column(nullable = false, length = 30) private String codigo;
    @Column(nullable = false, length = 120) private String nombre;
    @Column(nullable = false) private int cantidad;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal precioUnitario;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal subtotal;

    protected ItemOrden() {}
    public ItemOrden(String codigo, String nombre, int cantidad, BigDecimal precioUnitario) {
        this.codigo=codigo; this.nombre=nombre; this.cantidad=cantidad; this.precioUnitario=precioUnitario;
        this.subtotal=precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
    void setOrden(Orden orden) { this.orden=orden; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public int getCantidad() { return cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public BigDecimal getSubtotal() { return subtotal; }
}
