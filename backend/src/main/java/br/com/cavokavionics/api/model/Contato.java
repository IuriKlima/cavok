package br.com.cavokavionics.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contatos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    private String telefone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensagem;

    private Long produtoId;

    private Long aeronaveId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoContato tipo = TipoContato.CONTATO;

    @Builder.Default
    private Boolean lido = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
    }

    public enum TipoContato {
        CONTATO, COTACAO
    }
}
