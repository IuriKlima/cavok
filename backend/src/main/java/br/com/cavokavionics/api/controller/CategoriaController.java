package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Categoria;
import br.com.cavokavionics.api.model.Categoria.TipoCategoria;
import br.com.cavokavionics.api.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> listar(@RequestParam(required = false) String tipo) {
        if (tipo != null) {
            return categoriaRepository.findByTipoOrderByOrdemAsc(TipoCategoria.valueOf(tipo.toUpperCase()));
        }
        return categoriaRepository.findAll();
    }
}
