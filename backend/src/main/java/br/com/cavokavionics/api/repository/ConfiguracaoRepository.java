package br.com.cavokavionics.api.repository;

import br.com.cavokavionics.api.model.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {
    Optional<Configuracao> findByChave(String chave);
}
