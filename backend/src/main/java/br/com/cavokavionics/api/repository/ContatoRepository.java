package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Contato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Long> {
    Page<Contato> findAllByOrderByCriadoEmDesc(Pageable pageable);
    long countByLidoFalse();
}
