package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Configuracao;
import br.com.cavokavionics.api.model.Pagina;
import br.com.cavokavionics.api.repository.ConfiguracaoRepository;
import br.com.cavokavionics.api.repository.PaginaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SiteController {

    private final PaginaRepository paginaRepository;
    private final ConfiguracaoRepository configuracaoRepository;

    @GetMapping("/api/paginas/{slug}")
    public ResponseEntity<Pagina> pagina(@PathVariable String slug) {
        return paginaRepository.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/configuracoes")
    public Map<String, String> configuracoes() {
        return configuracaoRepository.findAll().stream()
            .collect(Collectors.toMap(Configuracao::getChave, c -> c.getValor() != null ? c.getValor() : ""));
    }
}
