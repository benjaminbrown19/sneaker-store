package cl.grip.backend.producto;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
class ProductoServiceTest {
 @Test void buscarDevuelve404SiNoExiste(){
   ProductoRepository repo=mock(ProductoRepository.class);
   when(repo.findById("SNK-999")).thenReturn(Optional.empty());
   ProductoService svc=new ProductoService(repo);
   assertThrows(ResponseStatusException.class,()->svc.buscar("SNK-999"));
 }
 @Test void eliminarNoBorraInexistente(){
   ProductoRepository repo=mock(ProductoRepository.class);
   when(repo.existsById("X")).thenReturn(false);
   ProductoService svc=new ProductoService(repo);
   assertThrows(ResponseStatusException.class,()->svc.eliminar("X"));
   verify(repo,never()).deleteById(anyString());
 }
}
