package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Aeronave.StatusAeronave;
import br.com.cavokavionics.api.model.Produto.StatusProduto;
import br.com.cavokavionics.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final ProdutoRepository produtoRepository;
    private final AeronaveRepository aeronaveRepository;
    private final ContatoRepository contatoRepository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public Map<String, Object> stats() {
        return Map.of(
            "totalProdutos", produtoRepository.countByStatus(StatusProduto.ATIVO),
            "totalAeronaves", aeronaveRepository.countByStatusNot(StatusAeronave.INATIVA),
            "totalCategorias", categoriaRepository.count(),
            "contatosNaoLidos", contatoRepository.countByLidoFalse()
        );
    }
}
