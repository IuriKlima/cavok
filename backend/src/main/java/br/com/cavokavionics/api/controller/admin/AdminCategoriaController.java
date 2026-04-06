package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Categoria;
import br.com.cavokavionics.api.model.Categoria.TipoCategoria;
import br.com.cavokavionics.api.repository.CategoriaRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categorias")
@RequiredArgsConstructor
public class AdminCategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> listar(@RequestParam(required = false) String tipo) {
        if (tipo != null) {
            return categoriaRepository.findByTipoOrderByOrdemAsc(TipoCategoria.valueOf(tipo.toUpperCase()));
        }
        return categoriaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Categoria> criar(@Valid @RequestBody CategoriaRequest request) {
        Categoria categoria = Categoria.builder()
            .nome(request.getNome())
            .slug(request.getSlug())
            .descricao(request.getDescricao())
            .imagemUrl(request.getImagemUrl())
            .tipo(TipoCategoria.valueOf(request.getTipo().toUpperCase()))
            .ordem(request.getOrdem())
            .build();
        return ResponseEntity.ok(categoriaRepository.save(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return categoriaRepository.findById(id)
            .map(cat -> {
                cat.setNome(request.getNome());
                cat.setSlug(request.getSlug());
                cat.setDescricao(request.getDescricao());
                cat.setImagemUrl(request.getImagemUrl());
                cat.setTipo(TipoCategoria.valueOf(request.getTipo().toUpperCase()));
                cat.setOrdem(request.getOrdem());
                return ResponseEntity.ok(categoriaRepository.save(cat));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        if (!categoriaRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoriaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Categoria deletada"));
    }

    @Data
    public static class CategoriaRequest {
        @NotBlank private String nome;
        @NotBlank private String slug;
        private String descricao;
        private String imagemUrl;
        @NotBlank private String tipo;
        private Integer ordem;
    }
}
