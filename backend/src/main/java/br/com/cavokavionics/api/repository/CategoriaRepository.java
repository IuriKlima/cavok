package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Categoria;
import br.com.cavokavionics.api.model.Categoria.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByTipoOrderByOrdemAsc(TipoCategoria tipo);
    Optional<Categoria> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
