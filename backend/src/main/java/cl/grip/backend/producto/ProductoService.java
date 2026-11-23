package cl.grip.backend.producto;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service
public class ProductoService {
  private final ProductoRepository repository;
  public ProductoService(ProductoRepository repository){this.repository=repository;}
  public List<Producto> listar(){return repository.findAll();}
  public Producto buscar(String codigo){return repository.findById(codigo).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Producto no encontrado"));}
  public Producto crear(Producto producto){
    if(repository.existsById(producto.getCodigo())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Codigo ya registrado");
    return repository.save(producto);
  }
  public Producto actualizar(String codigo,Producto producto){
    if(!repository.existsById(codigo)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Producto no encontrado");
    producto.setCodigo(codigo); return repository.save(producto);
  }
  public void eliminar(String codigo){
    if(!repository.existsById(codigo)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Producto no encontrado");
    repository.deleteById(codigo);
  }
}
