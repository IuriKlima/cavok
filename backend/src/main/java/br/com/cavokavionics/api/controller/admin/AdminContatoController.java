package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Contato;
import br.com.cavokavionics.api.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/contatos")
@RequiredArgsConstructor
public class AdminContatoController {

    private final ContatoRepository contatoRepository;

    @GetMapping
    public Page<Contato> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return contatoRepository.findAllByOrderByCriadoEmDesc(PageRequest.of(page, size));
    }

    @PutMapping("/{id}/lido")
    public ResponseEntity<Map<String, String>> marcarLido(@PathVariable Long id) {
        return contatoRepository.findById(id)
            .map(contato -> {
                contato.setLido(true);
                contatoRepository.save(contato);
                return ResponseEntity.ok(Map.of("message", "Marcado como lido"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        if (!contatoRepository.existsById(id)) return ResponseEntity.notFound().build();
        contatoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Contato deletado"));
    }
}
