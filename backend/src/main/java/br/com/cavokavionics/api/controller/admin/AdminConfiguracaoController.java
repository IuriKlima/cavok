package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Configuracao;
import br.com.cavokavionics.api.repository.ConfiguracaoRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/configuracoes")
@RequiredArgsConstructor
public class AdminConfiguracaoController {

    private final ConfiguracaoRepository configuracaoRepository;

    @GetMapping
    public List<Configuracao> listar() {
        return configuracaoRepository.findAll();
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> atualizar(@RequestBody List<ConfiguracaoRequest> requests) {
        for (ConfiguracaoRequest req : requests) {
            configuracaoRepository.findByChave(req.getChave()).ifPresentOrElse(
                config -> {
                    config.setValor(req.getValor());
                    configuracaoRepository.save(config);
                },
                () -> configuracaoRepository.save(Configuracao.builder()
                    .chave(req.getChave()).valor(req.getValor()).tipo(req.getTipo()).build())
            );
        }
        return ResponseEntity.ok(Map.of("message", "Configurações atualizadas"));
    }

    @Data
    public static class ConfiguracaoRequest {
        private String chave;
        private String valor;
        private String tipo;
    }
}
