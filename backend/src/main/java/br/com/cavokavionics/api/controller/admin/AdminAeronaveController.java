package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Aeronave;
import br.com.cavokavionics.api.repository.AeronaveRepository;
import br.com.cavokavionics.api.repository.CategoriaRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/aeronaves")
@RequiredArgsConstructor
public class AdminAeronaveController {

    private final AeronaveRepository aeronaveRepository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public Page<Aeronave> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return aeronaveRepository.findAll(PageRequest.of(page, size, Sort.by("criadoEm").descending()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aeronave> porId(@PathVariable Long id) {
        return aeronaveRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Aeronave> criar(@Valid @RequestBody AeronaveRequest request) {
        Aeronave aeronave = buildAeronave(new Aeronave(), request);
        return ResponseEntity.ok(aeronaveRepository.save(aeronave));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aeronave> atualizar(@PathVariable Long id, @Valid @RequestBody AeronaveRequest request) {
        return aeronaveRepository.findById(id)
            .map(aeronave -> {
                buildAeronave(aeronave, request);
                return ResponseEntity.ok(aeronaveRepository.save(aeronave));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        if (!aeronaveRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        aeronaveRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Aeronave deletada com sucesso"));
    }

    private Aeronave buildAeronave(Aeronave aeronave, AeronaveRequest req) {
        aeronave.setNome(req.getNome());
        aeronave.setSlug(req.getSlug());
        aeronave.setDescricao(req.getDescricao());
        aeronave.setAssentos(req.getAssentos());
        aeronave.setHorasCelula(req.getHorasCelula());
        aeronave.setAnoFabricacao(req.getAnoFabricacao());
        aeronave.setEspecificacoes(req.getEspecificacoes());
        aeronave.setPreco(req.getPreco());
        aeronave.setImagemPrincipal(req.getImagemPrincipal());
        aeronave.setImagens(req.getImagens() != null ? req.getImagens() : List.of());
        aeronave.setDestaque(req.getDestaque() != null ? req.getDestaque() : false);
        aeronave.setStatus(req.getStatus() != null ?
            Aeronave.StatusAeronave.valueOf(req.getStatus().toUpperCase()) : Aeronave.StatusAeronave.DISPONIVEL);

        if (req.getCategoriaId() != null) {
            categoriaRepository.findById(req.getCategoriaId()).ifPresent(aeronave::setCategoria);
        }
        return aeronave;
    }

    @Data
    public static class AeronaveRequest {
        @NotBlank private String nome;
        private String slug;
        private String descricao;
        private String assentos;
        private String horasCelula;
        private String anoFabricacao;
        private String especificacoes;
        private BigDecimal preco;
        private String imagemPrincipal;
        private List<String> imagens;
        private String status;
        private Boolean destaque;
        private Long categoriaId;
    }
}
