package cl.grip.backend.seguridad;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class UsuariosIniciales {
 @Bean CommandLineRunner cuentasIniciales(UsuarioRepository repo,PasswordEncoder encoder){return args->{
  crear(repo,encoder,"ana.perez@duoc.cl","Ana","administrador",System.getenv("GRIP_ADMIN_PASSWORD"));
  crear(repo,encoder,"carlos.soto@duoc.cl","Carlos","vendedor",System.getenv("GRIP_VENDEDOR_PASSWORD"));
 };}
 private void crear(UsuarioRepository repo,PasswordEncoder encoder,String correo,String nombre,String rol,String clave){
  if(clave==null||clave.length()<8||repo.existsByCorreoIgnoreCase(correo))return;
  Usuario u=new Usuario();u.setCorreo(correo);u.setNombre(nombre);u.setRol(rol);u.setPasswordHash(encoder.encode(clave));repo.save(u);
 }
}
