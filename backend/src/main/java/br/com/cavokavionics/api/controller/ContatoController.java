package br.com.cavokavionics.api.controller;

import br.com.cavokavionics.api.model.Contato;
import br.com.cavokavionics.api.repository.ContatoRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contato")
@RequiredArgsConstructor
public class ContatoController {

    private final ContatoRepository contatoRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> enviar(@Valid @RequestBody ContatoRequest request) {
        Contato contato = Contato.builder()
            .nome(request.getNome())
            .email(request.getEmail())
            .telefone(request.getTelefone())
            .mensagem(request.getMensagem())
            .produtoId(request.getProdutoId())
            .aeronaveId(request.getAeronaveId())
            .tipo(request.getTipo() != null ?
                Contato.TipoContato.valueOf(request.getTipo().toUpperCase()) :
                Contato.TipoContato.CONTATO)
            .build();

        contatoRepository.save(contato);

        return ResponseEntity.ok(Map.of("message", "Mensagem enviada com sucesso!"));
    }

    @Data
    public static class ContatoRequest {
        @NotBlank(message = "Nome é obrigatório")
        private String nome;

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        private String email;

        private String telefone;

        @NotBlank(message = "Mensagem é obrigatória")
        private String mensagem;

        private Long produtoId;
        private Long aeronaveId;
        private String tipo;
    }
}
