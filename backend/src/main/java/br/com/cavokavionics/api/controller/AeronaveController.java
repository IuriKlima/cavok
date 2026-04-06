package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Aeronave;
import br.com.cavokavionics.api.model.Aeronave.StatusAeronave;
import br.com.cavokavionics.api.repository.AeronaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aeronaves")
@RequiredArgsConstructor
public class AeronaveController {

    private final AeronaveRepository aeronaveRepository;

    @GetMapping
    public Page<Aeronave> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Long categoriaId) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("criadoEm").descending());

        if (categoriaId != null) {
            return aeronaveRepository.findByStatusNotAndCategoriaId(StatusAeronave.INATIVA, categoriaId, pageable);
        }

        return aeronaveRepository.findByStatusNot(StatusAeronave.INATIVA, pageable);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Aeronave> porSlug(@PathVariable String slug) {
        return aeronaveRepository.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/destaques")
    public List<Aeronave> destaques() {
        return aeronaveRepository.findByDestaqueTrue();
    }
}
