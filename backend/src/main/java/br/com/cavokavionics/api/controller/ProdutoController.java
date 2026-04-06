package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Produto;
import br.com.cavokavionics.api.model.Produto.StatusProduto;
import br.com.cavokavionics.api.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoRepository produtoRepository;

    @GetMapping
    public Page<Produto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long marcaId,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String dir) {

        Sort sorting = dir.equalsIgnoreCase("desc") ? Sort.by(sort).descending() : Sort.by(sort).ascending();
        PageRequest pageable = PageRequest.of(page, size, sorting);

        if (categoriaId != null && marcaId != null) {
            return produtoRepository.findByStatusAndCategoriaIdAndMarcaId(StatusProduto.ATIVO, categoriaId, marcaId, pageable);
        } else if (categoriaId != null) {
            return produtoRepository.findByStatusAndCategoriaId(StatusProduto.ATIVO, categoriaId, pageable);
        } else if (marcaId != null) {
            return produtoRepository.findByStatusAndMarcaId(StatusProduto.ATIVO, marcaId, pageable);
        }

        return produtoRepository.findByStatus(StatusProduto.ATIVO, pageable);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Produto> porSlug(@PathVariable String slug) {
        return produtoRepository.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/busca")
    public Page<Produto> buscar(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return produtoRepository.buscar(StatusProduto.ATIVO, q, PageRequest.of(page, size));
    }

    @GetMapping("/destaques")
    public List<Produto> destaques() {
        return produtoRepository.findByDestaqueTrue();
    }
}
