package br.com.cavokavionics.api.config;

import br.com.cavokavionics.api.model.*;
import br.com.cavokavionics.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    @Value("${admin.default.password}")
    private String adminDefaultPassword;

    private final UsuarioRepository usuarioRepository;
    private final ConfiguracaoRepository configuracaoRepository;
    private final CategoriaRepository categoriaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Criar admin padrão se não existir
        if (!usuarioRepository.existsByEmail("admin@cavokavionics.com.br")) {
            usuarioRepository.save(Usuario.builder()
                .nome("Administrador")
                .email("admin@cavokavionics.com.br")
                .senha(passwordEncoder.encode(adminDefaultPassword))
                .role(Usuario.Role.ADMIN)
                .build());
        }

        // Configurações padrão
        criarConfigSe("telefone", "(19) 98329-6170", "text");
        criarConfigSe("email", "orcamento@cavokavionics.com.br", "text");
        criarConfigSe("whatsapp", "5519983296170", "text");
        criarConfigSe("site_nome", "Cavok Avionics", "text");
        criarConfigSe("site_descricao", "Venda de Aviônicos e Aeronaves", "text");
        criarConfigSe("endereco", "", "text");
        criarConfigSe("instagram", "", "text");
        criarConfigSe("facebook", "", "text");
        criarConfigSe("youtube", "", "text");

        // Categorias de Produtos padrão
        criarCategoriaProdutoSe("PFD", "pfd", 1);
        criarCategoriaProdutoSe("Piloto Automático", "piloto-automatico", 2);
        criarCategoriaProdutoSe("Monitoramento de Motor", "monitoramento-de-motor", 3);
        criarCategoriaProdutoSe("GPS/Nav/Com", "gps-nav-com", 4);
        criarCategoriaProdutoSe("Transponder/ADS-B", "transponder-ads-b", 5);
        criarCategoriaProdutoSe("EFIS", "efis", 6);
        criarCategoriaProdutoSe("GPS", "gps", 7);
        criarCategoriaProdutoSe("Ângulo de Ataque/Pitot", "angulo-de-ataque-pitot", 8);
        criarCategoriaProdutoSe("Antenas", "antenas", 9);
        criarCategoriaProdutoSe("Bateria de Backup", "bateria-de-backup", 10);
        criarCategoriaProdutoSe("Carregador USB", "carregador-usb", 11);
        criarCategoriaProdutoSe("Nav/Com", "nav-com", 12);
        criarCategoriaProdutoSe("Painel de Áudio", "painel-de-audio", 13);
        criarCategoriaProdutoSe("Unidades de Interface", "unidades-de-interface", 14);
        criarCategoriaProdutoSe("Kits de Instalação", "kits-de-instalacao", 15);

        // Categorias de Aeronaves padrão
        criarCategoriaAeronaveSe("Monomotor Pistão", "monomotor-pistao", 1);
        criarCategoriaAeronaveSe("Monomotor Turboélice", "monomotor-turboelice", 2);
        criarCategoriaAeronaveSe("Bimotor Pistão", "bimotor-pistao", 3);
        criarCategoriaAeronaveSe("Bimotor Turboélice", "bimotor-turboelice", 4);
        criarCategoriaAeronaveSe("Jato", "jato", 5);
        criarCategoriaAeronaveSe("Helicópteros", "helicopteros", 6);
    }

    private void criarConfigSe(String chave, String valor, String tipo) {
        if (configuracaoRepository.findByChave(chave).isEmpty()) {
            configuracaoRepository.save(Configuracao.builder()
                .chave(chave).valor(valor).tipo(tipo).build());
        }
    }

    private void criarCategoriaProdutoSe(String nome, String slug, int ordem) {
        if (!categoriaRepository.existsBySlug(slug)) {
            categoriaRepository.save(Categoria.builder()
                .nome(nome).slug(slug).ordem(ordem)
                .tipo(Categoria.TipoCategoria.PRODUTO).build());
        }
    }

    private void criarCategoriaAeronaveSe(String nome, String slug, int ordem) {
        if (!categoriaRepository.existsBySlug(slug)) {
            categoriaRepository.save(Categoria.builder()
                .nome(nome).slug(slug).ordem(ordem)
                .tipo(Categoria.TipoCategoria.AERONAVE).build());
        }
    }
}
