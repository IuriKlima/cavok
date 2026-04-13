import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynpzkzkypusjxwdfpaxv.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTg3NDIsImV4cCI6MjA5MTU5NDc0Mn0.VvCnUfGqyE0it3dqagi5pCTJ4qhD_98p1TjYjnQovu0'
);

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
