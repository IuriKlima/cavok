import { createClient } from '@supabase/supabase-js';

// Impedir cache — sempre buscar dados frescos do Supabase
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials missing in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Buscar tudo em paralelo
    const [configRes, catProdRes, catAeroRes, slidesRes] = await Promise.all([
      supabase.from('configuracoes').select('*'),
      supabase.from('categorias').select('*').eq('tipo', 'PRODUTO').order('ordem', { ascending: true }),
      supabase.from('categorias').select('*').eq('tipo', 'AERONAVE').order('ordem', { ascending: true }),
      supabase.from('slides').select('*').eq('ativo', true).order('ordem', { ascending: true }),
    ]);

    // Mapear configurações para objeto chave: valor
    const config = {};
    if (configRes.data) {
      configRes.data.forEach(c => { config[c.chave] = c.valor; });
    }

    return Response.json({
      config,
      categoriasProduto: catProdRes.data || [],
      categoriasAeronave: catAeroRes.data || [],
      categorias: [...(catProdRes.data || []), ...(catAeroRes.data || [])],
      slides: slidesRes.data || [],
    });
  } catch (error) {
    console.error('Erro ao carregar site-data:', error);
    return Response.json({
      config: {},
      categoriasProduto: [],
      categoriasAeronave: [],
      categorias: [],
      slides: [],
    }, { status: 500 });
  }
}
