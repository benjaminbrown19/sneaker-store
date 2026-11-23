package cl.grip.backend.seguridad;
import jakarta.persistence.*;
@Entity @Table(name="usuarios_auth")
public class Usuario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true,length=150) private String correo;
 @Column(nullable=false) private String passwordHash;
 @Column(nullable=false,length=30) private String rol;
 @Column(nullable=false,length=120) private String nombre;
 public Long getId(){return id;} public String getCorreo(){return correo;} public void setCorreo(String v){correo=v;}
 public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
 public String getRol(){return rol;} public void setRol(String v){rol=v;}
 public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
}
