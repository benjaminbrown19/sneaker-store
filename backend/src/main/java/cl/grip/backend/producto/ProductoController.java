package cl.grip.backend.producto;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
  private final ProductoService service;
  public ProductoController(ProductoService service){this.service=service;}
  @GetMapping public List<Producto> listar(){return service.listar();}
  @GetMapping("/{codigo}") public Producto buscar(@PathVariable String codigo){return service.buscar(codigo);}
  @PostMapping public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto){
    Producto creado=service.crear(producto);
    return ResponseEntity.created(URI.create("/api/v1/productos/"+creado.getCodigo())).body(creado);
  }
  @PutMapping("/{codigo}") public Producto actualizar(@PathVariable String codigo,@Valid @RequestBody Producto producto){return service.actualizar(codigo,producto);}
  @DeleteMapping("/{codigo}") public ResponseEntity<Void> eliminar(@PathVariable String codigo){service.eliminar(codigo);return ResponseEntity.noContent().build();}
}
