package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
    Optional<Marca> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
