const fs = require('fs');
const { DOMParser } = require('xmldom');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynpzkzkypusjxwdfpaxv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190';
const supabase = createClient(supabaseUrl, supabaseKey);

function getTagValue(parent, tagName) {
    const nodes = parent.getElementsByTagName(tagName);
    if (nodes && nodes.length > 0 && nodes[0].childNodes && nodes[0].childNodes.length > 0) {
        return nodes[0].textContent || nodes[0].nodeValue || "";
    }
    return null;
}

function getTerms(item, taxonomyName) {
    const categories = item.getElementsByTagName('category');
    const terms = [];
    for (let i = 0; i < categories.length; i++) {
        const domain = categories[i].getAttribute('domain');
        if (domain === taxonomyName) {
            terms.push({
                name: categories[i].textContent,
                slug: categories[i].getAttribute('nicename')
            });
        }
    }
    return terms;
}

async function run() {
    console.log("==> Sincronizando Categorias e relacionando...");
    const xmlData = fs.readFileSync('cavokavionicsvendadeavinicoseaeronaves.WordPress.2026-03-27.xml', 'utf-8');
    const doc = new DOMParser().parseFromString(xmlData, 'text/xml');
    
    // 1: Extrair e Salvar categorias explicitas do cabecalho wp:term
    const terms = doc.getElementsByTagName('wp:term');
    const catMap = {}; // slug -> id
    
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        const tax = getTagValue(term, 'wp:term_taxonomy');
        if (tax === 'product_cat' || tax === 'categoria-da-aeronave' || tax === 'category') {
            const slug = getTagValue(term, 'wp:term_slug');
            const nome = getTagValue(term, 'wp:term_name') || slug;
            const tipo = tax === 'product_cat' ? 'PRODUTO' : 'AERONAVE';
            
            console.log(`Inserindo categoria: ${nome} (${tipo})`);
            const { data, error } = await supabase.from('categorias').upsert({
                slug, nome, tipo
            }, { onConflict: 'slug' }).select('id').single();
            
            if (data) catMap[slug] = data.id;
        }
    }

    // 2: Atualizar produtos e aeronaves
    const items = doc.getElementsByTagName('item');
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const postType = getTagValue(item, 'wp:post_type');
        const slug = getTagValue(item, 'wp:post_name');
        
        if (postType === 'product') {
            const productCats = getTerms(item, 'product_cat');
            if (productCats.length > 0 && catMap[productCats[0].slug]) {
                const catId = catMap[productCats[0].slug];
                await supabase.from('produtos').update({ categoria_id: catId }).eq('slug', slug);
                console.log(`[Produto] ${slug} -> Categoria Associada!`);
            }
        } else if (postType === 'aeronave') {
            const aeroCats = getTerms(item, 'categoria-da-aeronave');
            if (aeroCats.length > 0 && catMap[aeroCats[0].slug]) {
                const catId = catMap[aeroCats[0].slug];
                await supabase.from('aeronaves').update({ categoria_id: catId }).eq('slug', slug);
                console.log(`[Aeronave] ${slug} -> Categoria Associada!`);
            }
        }
    }
    
    // Inserir configurações base para ter onde hospedar a imagem default
    await supabase.from('configuracoes').upsert([
        { chave: 'site_nome', valor: 'Cavok Avionics', tipo: 'string' },
        { chave: 'logo_avionicos', valor: '', tipo: 'string' },
        { chave: 'logo_aeronaves', valor: '', tipo: 'string' },
    ], { onConflict: 'chave' });

    console.log("==> FINALIZADO C/ SUCESSO!");
}
run();
