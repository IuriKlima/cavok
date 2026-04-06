package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Pagina;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaginaRepository extends JpaRepository<Pagina, Long> {
    Optional<Pagina> findBySlug(String slug);
}
