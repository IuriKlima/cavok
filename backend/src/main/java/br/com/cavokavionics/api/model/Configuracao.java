package br.com.cavokavionics.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracoes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Configuracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String chave;

    @Column(columnDefinition = "TEXT")
    private String valor;

    private String tipo; // text, image, json, html
}
