package cl.grip.backend.producto;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {
  @Id
  @NotBlank
  @Size(max=30)
  @Column(length=30,nullable=false)
  private String codigo;
  @NotBlank @Size(max=120)
  @Column(nullable=false,length=120)
  private String nombre;
  @Size(max=2000)
  @Column(length=2000)
  private String descripcion;
  @NotNull @DecimalMin("0.0")
  @Column(nullable=false,precision=12,scale=2)
  private BigDecimal precio;
  @NotNull @Min(0)
  @Column(nullable=false)
  private Integer stock;
  @NotNull @Min(0)
  @Column(nullable=false)
  private Integer stockCritico;
  @NotBlank @Size(max=60)
  @Column(nullable=false,length=60)
  private String categoria;
  @NotNull @Min(0) @Max(100)
  @Column(nullable=false)
  private Integer descuento;
  @Size(max=500)
  @Column(length=500)
  private String imagen;
  public String getCodigo(){return codigo;}
  public void setCodigo(String v){codigo=v;}
  public String getNombre(){return nombre;}
  public void setNombre(String v){nombre=v;}
  public String getDescripcion(){return descripcion;}
  public void setDescripcion(String v){descripcion=v;}
  public BigDecimal getPrecio(){return precio;}
  public void setPrecio(BigDecimal v){precio=v;}
  public Integer getStock(){return stock;}
  public void setStock(Integer v){stock=v;}
  public Integer getStockCritico(){return stockCritico;}
  public void setStockCritico(Integer v){stockCritico=v;}
  public String getCategoria(){return categoria;}
  public void setCategoria(String v){categoria=v;}
  public Integer getDescuento(){return descuento;}
  public void setDescuento(Integer v){descuento=v;}
  public String getImagen(){return imagen;}
  public void setImagen(String v){imagen=v;}
}
