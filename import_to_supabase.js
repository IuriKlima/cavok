const fs = require('fs');
const { DOMParser } = require('xmldom');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynpzkzkypusjxwdfpaxv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImageToSupabase(imageUrl) {
    if (!imageUrl) return null;
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const buffer = await response.arrayBuffer();
        
        const parts = imageUrl.split('/');
        let fileName = parts[parts.length - 1];
        if (fileName.includes('?')) fileName = fileName.split('?')[0];

        fileName = Date.now() + '_' + fileName;

        const { data, error } = await supabase.storage
            .from('public-images')
            .upload(fileName, buffer, {
                contentType: response.headers.get('content-type') || 'image/jpeg',
                upsert: true
            });

        if (error) {
            console.error('Erro no upload Storage:', error.message);
            return null;
        }
        
        const publicUrlData = supabase.storage.from('public-images').getPublicUrl(fileName);
        return publicUrlData.data.publicUrl;
    } catch (err) {
        console.error('Falha baixando imagem origem:', imageUrl, err.message);
        return null;
    }
}

function getTagValue(parent, tagName) {
    const nodes = parent.getElementsByTagName(tagName);
    if (nodes && nodes.length > 0 && nodes[0].childNodes && nodes[0].childNodes.length > 0) {
        return nodes[0].textContent || nodes[0].nodeValue || "";
    }
    return null;
}

function getPostMetas(item) {
    const metas = {};
    const metaNodes = item.getElementsByTagName('wp:postmeta');
    for (let i = 0; i < metaNodes.length; i++) {
        const key = getTagValue(metaNodes[i], 'wp:meta_key');
        const value = getTagValue(metaNodes[i], 'wp:meta_value');
        if (key && value) {
            metas[key] = value;
        }
    }
    return metas;
}

async function run() {
    console.log("==> Iniciando script Supabase V2 com Upsert (Aeronaves + Imagens)...");

    const xmlData = fs.readFileSync('cavokavionicsvendadeavinicoseaeronaves.WordPress.2026-03-27.xml', 'utf-8');
    const doc = new DOMParser().parseFromString(xmlData, 'text/xml');
    const items = doc.getElementsByTagName('item');
    
    // Pass 1: Map attachments
    const attachmentMap = {};
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const postType = getTagValue(item, 'wp:post_type');
        if (postType === 'attachment') {
            const postId = getTagValue(item, 'wp:post_id');
            const url = getTagValue(item, 'wp:attachment_url');
            if (postId && url) attachmentMap[postId] = url;
        }
    }
    console.log(`Encontrados ${Object.keys(attachmentMap).length} anexos no XML.`);

    // Pass 2: Upsert products and aircrafts
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const postType = getTagValue(item, 'wp:post_type');
        const status = getTagValue(item, 'wp:status');

        if (status !== 'publish') continue;

        if (postType === 'product') {
            const nome = getTagValue(item, 'title');
            let slug = getTagValue(item, 'wp:post_name') || nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const descricao = getTagValue(item, 'content:encoded');
            const descricao_curta = getTagValue(item, 'excerpt:encoded');
            
            const metas = getPostMetas(item);
            const preco = metas['_price'] || metas['_regular_price'];
            const sku = metas['_sku'];

            const thumbId = metas['_thumbnail_id'];
            const rawImageUrl = thumbId ? attachmentMap[thumbId] : null;

            let newSupabaseImageUrl = null;
            if (rawImageUrl) {
                console.log(`[Produto] Baixando imagem: ${rawImageUrl}...`);
                newSupabaseImageUrl = await uploadImageToSupabase(rawImageUrl);
            }

            console.log(`Upsert Produto: ${nome}...`);
            const { error } = await supabase.from('produtos').upsert({
                nome: nome,
                slug: slug,
                descricao: descricao,
                descricao_curta: descricao_curta,
                preco: preco ? parseFloat(preco) : null,
                sku: sku,
                imagem_url: newSupabaseImageUrl
            }, { onConflict: 'slug' });
            
            if (error) console.error("Erro banco: ", error.message);
        } else if (postType === 'aeronave') {
            const nome = getTagValue(item, 'title');
            let slug = getTagValue(item, 'wp:post_name') || nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const descricao = getTagValue(item, 'content:encoded');

            const metas = getPostMetas(item);
            const assentos = metas['Assentos'] || metas['assentos'];
            const horasF = metas['Horas totais de célula'];
            const ano = metas['Ano de fabricação'];

            const thumbId = metas['_thumbnail_id'];
            const rawImageUrl = thumbId ? attachmentMap[thumbId] : null;

            let newSupabaseImageUrl = null;
            if (rawImageUrl) {
                console.log(`[Aeronave] Baixando imagem: ${rawImageUrl}...`);
                newSupabaseImageUrl = await uploadImageToSupabase(rawImageUrl);
            }

            console.log(`Upsert Aeronave: ${nome}...`);
            const { error } = await supabase.from('aeronaves').upsert({
                nome: nome,
                slug: slug,
                descricao: descricao,
                assentos: assentos,
                horas_celula: horasF,
                ano_fabricacao: ano,
                imagem_url: newSupabaseImageUrl
            }, { onConflict: 'slug' });
            
            if (error) console.error("Erro banco aeronave: ", error.message);
        }
    }
    console.log("==> FINALIZADO C/ AERONAVES E IMAGENS LOGADAS!");
}

run();
