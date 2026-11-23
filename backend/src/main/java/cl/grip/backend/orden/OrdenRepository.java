package cl.grip.backend.orden;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenRepository extends JpaRepository<Orden, String> {
    @Override @EntityGraph(attributePaths = "items") List<Orden> findAll();
    @Override @EntityGraph(attributePaths = "items") java.util.Optional<Orden> findById(String id);
}
