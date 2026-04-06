package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Produto;
import br.com.cavokavionics.api.model.Produto.StatusProduto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findBySlug(String slug);
    boolean existsBySlug(String slug);

    Page<Produto> findByStatus(StatusProduto status, Pageable pageable);

    Page<Produto> findByStatusAndCategoriaId(StatusProduto status, Long categoriaId, Pageable pageable);

    Page<Produto> findByStatusAndMarcaId(StatusProduto status, Long marcaId, Pageable pageable);

    Page<Produto> findByStatusAndCategoriaIdAndMarcaId(StatusProduto status, Long categoriaId, Long marcaId, Pageable pageable);

    List<Produto> findByDestaqueTrue();

    @Query("SELECT p FROM Produto p WHERE p.status = :status AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.descricao) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Produto> buscar(@Param("status") StatusProduto status, @Param("q") String q, Pageable pageable);

    long countByStatus(StatusProduto status);
}
