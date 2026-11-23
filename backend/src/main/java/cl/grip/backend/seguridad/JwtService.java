package cl.grip.backend.seguridad;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service public class JwtService {
 private final SecretKey key; private final long ttl; private final long refreshTtl;
 public JwtService(@Value("${grip.jwt.secret}") String secret,@Value("${grip.jwt.expiration-ms}") long ttl,@Value("${grip.jwt.refresh-expiration-ms}") long refreshTtl){
   if(secret.getBytes(StandardCharsets.UTF_8).length<32) throw new IllegalArgumentException("GRIP_JWT_SECRET debe tener al menos 32 bytes");
   this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.ttl=ttl;this.refreshTtl=refreshTtl;
 }
 public String emitir(Usuario u,boolean refresh){Instant now=Instant.now();return Jwts.builder().subject(u.getCorreo()).claim("rol",u.getRol()).claim("tipo",refresh?"refresh":"access")
 .issuedAt(Date.from(now)).expiration(Date.from(now.plusMillis(refresh?refreshTtl:ttl))).signWith(key).compact();}
 public Claims validar(String token,String tipo){Claims c=Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();if(!tipo.equals(c.get("tipo",String.class)))throw new IllegalArgumentException("Tipo de token invalido");return c;}
}
