package br.com.cavokavionics.api.service;

import br.com.cavokavionics.api.model.*;
import br.com.cavokavionics.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class XmlImportService {

    private final ProdutoRepository produtoRepository;
    private final AeronaveRepository aeronaveRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> importarXml(InputStream xmlInputStream) {
        int produtosImportados = 0;
        int aeronavesImportadas = 0;
        int imagensEncontradas = 0;
        List<String> erros = new ArrayList<>();

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(xmlInputStream);

            NodeList items = doc.getElementsByTagName("item");
            log.info("XML contém {} itens", items.getLength());

            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);
                String postType = getTagValue(item, "wp:post_type");
                String status = getTagValue(item, "wp:status");

                if ("product".equals(postType) && "publish".equals(status)) {
                    try {
                        importarProduto(item);
                        produtosImportados++;
                    } catch (Exception e) {
                        erros.add("Erro produto: " + getTagValue(item, "title") + " - " + e.getMessage());
                    }
                } else if ("aeronave".equals(postType) && "publish".equals(status)) {
                    try {
                        importarAeronave(item);
                        aeronavesImportadas++;
                    } catch (Exception e) {
                        erros.add("Erro aeronave: " + getTagValue(item, "title") + " - " + e.getMessage());
                    }
                } else if ("attachment".equals(postType)) {
                    imagensEncontradas++;
                }
            }
        } catch (Exception e) {
            erros.add("Erro geral: " + e.getMessage());
            log.error("Erro ao importar XML", e);
        }

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("produtosImportados", produtosImportados);
        resultado.put("aeronavesImportadas", aeronavesImportadas);
        resultado.put("imagensEncontradas", imagensEncontradas);
        resultado.put("erros", erros);
        return resultado;
    }

    private void importarProduto(Element item) {
        String nome = getTagValue(item, "title");
        String slug = getTagValue(item, "wp:post_name");

        if (slug == null || slug.isBlank()) {
            slug = nome.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        }

        if (produtoRepository.existsBySlug(slug)) {
            log.info("Produto já existe: {}", slug);
            return;
        }

        String descricao = getTagValue(item, "content:encoded");
        String descricaoCurta = getTagValue(item, "excerpt:encoded");

        // Extrair metadados
        Map<String, String> metas = getPostMetas(item);
        String precoStr = metas.getOrDefault("_price", metas.get("_regular_price"));
        String sku = metas.getOrDefault("_sku", "");
        String imagemUrl = metas.get("_wp_attached_file");

        // Buscar categoria do produto
        Categoria categoria = null;
        List<String> categorias = getTerms(item, "product_cat");
        if (!categorias.isEmpty()) {
            String catSlug = categorias.get(0).toLowerCase().replaceAll("[^a-z0-9]+", "-");
            categoria = categoriaRepository.findBySlug(catSlug).orElse(null);
        }

        // Buscar marca
        Marca marca = null;
        List<String> marcas = getTerms(item, "marca");
        if (!marcas.isEmpty()) {
            String marcaSlug = marcas.get(0).toLowerCase().replaceAll("[^a-z0-9]+", "-");
            marca = marcaRepository.findBySlug(marcaSlug).orElseGet(() -> {
                Marca novaMarca = Marca.builder()
                    .nome(marcas.get(0))
                    .slug(marcaSlug)
                    .build();
                return marcaRepository.save(novaMarca);
            });
        }

        // Verificar homologação
        List<String> homologacao = getTerms(item, "homologado");
        Boolean homologado = homologacao.stream()
            .anyMatch(h -> h.toLowerCase().contains("homologado") && !h.toLowerCase().contains("não"));

        // Condição
        List<String> condicaoTerms = getTerms(item, "condicao");
        String condicao = condicaoTerms.isEmpty() ? null : condicaoTerms.get(0);

        BigDecimal preco = null;
        if (precoStr != null && !precoStr.isBlank()) {
            try { preco = new BigDecimal(precoStr); } catch (Exception ignored) {}
        }

        Produto produto = Produto.builder()
            .nome(nome)
            .slug(slug)
            .descricao(descricao)
            .descricaoCurta(descricaoCurta)
            .preco(preco)
            .sku(sku)
            .homologado(homologado)
            .condicao(condicao)
            .categoria(categoria)
            .marca(marca)
            .status(Produto.StatusProduto.ATIVO)
            .build();

        produtoRepository.save(produto);
        log.info("Produto importado: {}", nome);
    }

    private void importarAeronave(Element item) {
        String nome = getTagValue(item, "title");
        String slug = getTagValue(item, "wp:post_name");

        if (slug == null || slug.isBlank()) {
            slug = nome.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        }

        if (aeronaveRepository.existsBySlug(slug)) {
            log.info("Aeronave já existe: {}", slug);
            return;
        }

        Map<String, String> metas = getPostMetas(item);

        // Buscar categoria da aeronave
        Categoria categoria = null;
        List<String> categorias = getTerms(item, "gategoria-da-aeronave");
        if (!categorias.isEmpty()) {
            String catSlug = categorias.get(0).toLowerCase().replaceAll("[^a-z0-9]+", "-");
            categoria = categoriaRepository.findBySlug(catSlug).orElse(null);
        }

        Aeronave aeronave = Aeronave.builder()
            .nome(nome)
            .slug(slug)
            .descricao(getTagValue(item, "content:encoded"))
            .assentos(metas.get("Assentos"))
            .horasCelula(metas.get("Horas totais de célula"))
            .anoFabricacao(metas.get("Ano de fabricação"))
            .especificacoes(metas.get("especificacoes"))
            .categoria(categoria)
            .status(Aeronave.StatusAeronave.DISPONIVEL)
            .build();

        aeronaveRepository.save(aeronave);
        log.info("Aeronave importada: {}", nome);
    }

    private String getTagValue(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes.getLength() > 0) {
            Node node = nodes.item(0);
            return node.getTextContent();
        }
        return null;
    }

    private Map<String, String> getPostMetas(Element item) {
        Map<String, String> metas = new HashMap<>();
        NodeList metaNodes = item.getElementsByTagName("wp:postmeta");
        for (int i = 0; i < metaNodes.getLength(); i++) {
            Element meta = (Element) metaNodes.item(i);
            String key = getTagValue(meta, "wp:meta_key");
            String value = getTagValue(meta, "wp:meta_value");
            if (key != null && value != null) {
                metas.put(key, value);
            }
        }
        return metas;
    }

    private List<String> getTerms(Element item, String taxonomy) {
        List<String> terms = new ArrayList<>();
        NodeList categories = item.getElementsByTagName("category");
        for (int i = 0; i < categories.getLength(); i++) {
            Element cat = (Element) categories.item(i);
            String domain = cat.getAttribute("domain");
            if (taxonomy.equals(domain)) {
                terms.add(cat.getTextContent());
            }
        }
        return terms;
    }
}
