package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Pagina;
import br.com.cavokavionics.api.repository.PaginaRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/paginas")
@RequiredArgsConstructor
public class AdminPaginaController {

    private final PaginaRepository paginaRepository;

    @GetMapping
    public List<Pagina> listar() {
        return paginaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pagina> porId(@PathVariable Long id) {
        return paginaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pagina> criar(@Valid @RequestBody PaginaRequest request) {
        Pagina pagina = Pagina.builder()
            .titulo(request.getTitulo())
            .slug(request.getSlug())
            .conteudo(request.getConteudo())
            .metaTitle(request.getMetaTitle())
            .metaDescription(request.getMetaDescription())
            .imagemDestaque(request.getImagemDestaque())
            .build();
        return ResponseEntity.ok(paginaRepository.save(pagina));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pagina> atualizar(@PathVariable Long id, @Valid @RequestBody PaginaRequest request) {
        return paginaRepository.findById(id)
            .map(pagina -> {
                pagina.setTitulo(request.getTitulo());
                pagina.setSlug(request.getSlug());
                pagina.setConteudo(request.getConteudo());
                pagina.setMetaTitle(request.getMetaTitle());
                pagina.setMetaDescription(request.getMetaDescription());
                pagina.setImagemDestaque(request.getImagemDestaque());
                return ResponseEntity.ok(paginaRepository.save(pagina));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        if (!paginaRepository.existsById(id)) return ResponseEntity.notFound().build();
        paginaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Página deletada"));
    }

    @Data
    public static class PaginaRequest {
        @NotBlank private String titulo;
        @NotBlank private String slug;
        private String conteudo;
        private String metaTitle;
        private String metaDescription;
        private String imagemDestaque;
    }
}
