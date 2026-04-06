package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Produto;
import br.com.cavokavionics.api.repository.CategoriaRepository;
import br.com.cavokavionics.api.repository.MarcaRepository;
import br.com.cavokavionics.api.repository.ProdutoRepository;
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
@RequestMapping("/api/admin/produtos")
@RequiredArgsConstructor
public class AdminProdutoController {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;

    @GetMapping
    public Page<Produto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("criadoEm").descending());
        if (q != null && !q.isBlank()) {
            return produtoRepository.buscar(null, q, pageable);
        }
        return produtoRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> porId(@PathVariable Long id) {
        return produtoRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest request) {
        Produto produto = buildProduto(new Produto(), request);
        return ResponseEntity.ok(produtoRepository.save(produto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest request) {
        return produtoRepository.findById(id)
            .map(produto -> {
                buildProduto(produto, request);
                return ResponseEntity.ok(produtoRepository.save(produto));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Produto deletado com sucesso"));
    }

    private Produto buildProduto(Produto produto, ProdutoRequest req) {
        produto.setNome(req.getNome());
        produto.setSlug(req.getSlug());
        produto.setDescricao(req.getDescricao());
        produto.setDescricaoCurta(req.getDescricaoCurta());
        produto.setPreco(req.getPreco());
        produto.setSku(req.getSku());
        produto.setImagemPrincipal(req.getImagemPrincipal());
        produto.setImagens(req.getImagens() != null ? req.getImagens() : List.of());
        produto.setHomologado(req.getHomologado());
        produto.setCondicao(req.getCondicao());
        produto.setDestaque(req.getDestaque() != null ? req.getDestaque() : false);
        produto.setStatus(req.getStatus() != null ?
            Produto.StatusProduto.valueOf(req.getStatus().toUpperCase()) : Produto.StatusProduto.ATIVO);

        if (req.getCategoriaId() != null) {
            categoriaRepository.findById(req.getCategoriaId()).ifPresent(produto::setCategoria);
        }
        if (req.getMarcaId() != null) {
            marcaRepository.findById(req.getMarcaId()).ifPresent(produto::setMarca);
        }
        return produto;
    }

    @Data
    public static class ProdutoRequest {
        @NotBlank private String nome;
        private String slug;
        private String descricao;
        private String descricaoCurta;
        private BigDecimal preco;
        private String sku;
        private String imagemPrincipal;
        private List<String> imagens;
        private Boolean homologado;
        private String condicao;
        private String status;
        private Boolean destaque;
        private Long categoriaId;
        private Long marcaId;
    }
}
