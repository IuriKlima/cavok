package br.com.cavokavionics.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aeronaves")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Aeronave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    private String assentos;

    private String horasCelula;

    private String anoFabricacao;

    @Column(columnDefinition = "TEXT")
    private String especificacoes;

    private BigDecimal preco;

    private String imagemPrincipal;

    @ElementCollection
    @CollectionTable(name = "aeronave_imagens", joinColumns = @JoinColumn(name = "aeronave_id"))
    @Column(name = "imagem_url")
    @Builder.Default
    private List<String> imagens = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusAeronave status = StatusAeronave.DISPONIVEL;

    @Builder.Default
    private Boolean destaque = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
        if (slug == null && nome != null) {
            slug = nome.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    public enum StatusAeronave {
        DISPONIVEL, VENDIDA, RESERVADA, INATIVA
    }
}
