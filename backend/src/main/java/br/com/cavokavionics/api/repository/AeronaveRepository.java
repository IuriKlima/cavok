package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Aeronave;
import br.com.cavokavionics.api.model.Aeronave.StatusAeronave;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AeronaveRepository extends JpaRepository<Aeronave, Long> {
    Optional<Aeronave> findBySlug(String slug);
    boolean existsBySlug(String slug);

    Page<Aeronave> findByStatusNot(StatusAeronave status, Pageable pageable);

    Page<Aeronave> findByStatusNotAndCategoriaId(StatusAeronave status, Long categoriaId, Pageable pageable);

    List<Aeronave> findByDestaqueTrue();

    long countByStatusNot(StatusAeronave status);
}
