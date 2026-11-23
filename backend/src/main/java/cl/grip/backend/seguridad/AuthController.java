package cl.grip.backend.seguridad;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
 private final UsuarioRepository usuarios;private final PasswordEncoder encoder;private final JwtService jwt;
 public AuthController(UsuarioRepository usuarios,PasswordEncoder encoder,JwtService jwt){this.usuarios=usuarios;this.encoder=encoder;this.jwt=jwt;}
 public record Login(@Email @NotBlank String correo,@NotBlank String password){}
 public record Registro(@Email @NotBlank String correo,@NotBlank @Size(min=8) String password,@NotBlank String nombre){}
 public record Refresh(@NotBlank String refreshToken){}
 private Map<String,Object> respuesta(Usuario u){return Map.of("accessToken",jwt.emitir(u,false),"refreshToken",jwt.emitir(u,true),"usuario",Map.of("id",u.getId(),"correo",u.getCorreo(),"nombre",u.getNombre(),"rol",u.getRol()));}
 @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody Login l){Usuario u=usuarios.findByCorreoIgnoreCase(l.correo()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales invalidas"));if(!encoder.matches(l.password(),u.getPasswordHash()))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales invalidas");return respuesta(u);}
 @PostMapping("/registro") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> registrar(@Valid @RequestBody Registro r){if(usuarios.existsByCorreoIgnoreCase(r.correo()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Correo ya registrado");Usuario u=new Usuario();u.setCorreo(r.correo().trim().toLowerCase());u.setNombre(r.nombre().trim());u.setRol("cliente");u.setPasswordHash(encoder.encode(r.password()));return respuesta(usuarios.save(u));}
 @PostMapping("/refresh") public Map<String,Object> renovar(@Valid @RequestBody Refresh r){try{String correo=jwt.validar(r.refreshToken(),"refresh").getSubject();Usuario u=usuarios.findByCorreoIgnoreCase(correo).orElseThrow();return respuesta(u);}catch(Exception e){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Token invalido o expirado");}}
}
