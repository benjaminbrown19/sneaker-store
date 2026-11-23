package cl.grip.backend.orden;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ordenes")
public class OrdenController {
    private final OrdenService service;

    public OrdenController(OrdenService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrdenApi.Respuesta> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public OrdenApi.Respuesta buscar(@PathVariable String id) {
        return service.buscar(id);
    }

    // Endpoint de tienda: permite checkout como invitado, pero fuerza el canal online.
    @PostMapping("/checkout")
    public ResponseEntity<OrdenApi.Respuesta> crearCheckout(
            @Valid @RequestBody OrdenApi.Crear entrada) {
        OrdenApi.Respuesta creada = service.crearCheckout(entrada);
        return ResponseEntity.created(URI.create("/api/v1/ordenes/" + creada.id())).body(creada);
    }

    // Endpoint interno: requiere JWT de administrador, vendedor o cliente.
    @PostMapping
    public ResponseEntity<OrdenApi.Respuesta> crear(
            @Valid @RequestBody OrdenApi.Crear entrada) {
        OrdenApi.Respuesta creada = service.crear(entrada);
        return ResponseEntity.created(URI.create("/api/v1/ordenes/" + creada.id())).body(creada);
    }
}
