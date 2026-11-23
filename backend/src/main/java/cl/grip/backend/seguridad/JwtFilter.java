package cl.grip.backend.seguridad;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
public class JwtFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UsuarioRepository usuarios;
 public JwtFilter(JwtService jwt,UsuarioRepository usuarios){this.jwt=jwt;this.usuarios=usuarios;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String auth=req.getHeader("Authorization");
  if(auth!=null&&auth.startsWith("Bearer ")){
   try{String correo=jwt.validar(auth.substring(7),"access").getSubject(); usuarios.findByCorreoIgnoreCase(correo).ifPresent(u->{
      var token=new UsernamePasswordAuthenticationToken(u.getCorreo(),null,List.of(new SimpleGrantedAuthority("ROLE_"+u.getRol().toUpperCase())));
      SecurityContextHolder.getContext().setAuthentication(token);
   });}catch(Exception ex){SecurityContextHolder.clearContext();}
  }chain.doFilter(req,res);
 }
}
