package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Marca;
import br.com.cavokavionics.api.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
public class MarcaController {

    private final MarcaRepository marcaRepository;

    @GetMapping
    public List<Marca> listar() {
        return marcaRepository.findAll();
    }
}
