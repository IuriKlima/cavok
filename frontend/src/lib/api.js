import { supabase } from './supabase';

// Mapeia campos snake_case do Supabase para camelCase do frontend legado
function mapItem(item) {
  if (!item) return item;
  return {
    ...item,
    imagemPrincipal: item.imagem_url || null,
    descricaoCurta: item.descricao_curta || null,
    categoriaId: item.categoria_id || null,
    marcaId: item.marca_id || null,
    imagemUrl: item.imagem_url || null,
  };
}

function mapList(items) {
  return (items || []).map(mapItem);
}

function formatPagination(data, count, size) {
  return { content: mapList(data), totalElements: count || 0, totalPages: Math.ceil((count || 0) / size) };
}

// ====== Produtos ======
export async function getProdutos({ page = 0, size = 12, categoriaId, marcaId } = {}) {
  let query = supabase.from('produtos').select('*, categoria:categorias(nome)', { count: 'exact' });
  if (categoriaId) query = query.eq('categoria_id', categoriaId);
  if (marcaId) query = query.eq('marca_id', marcaId);
  
  const { data, count, error } = await query
    .eq('status', 'ATIVO')
    .range(page * size, (page + 1) * size - 1)
    .order('created_at', { ascending: false });
    
  if (error) console.error(error);
  return formatPagination(data, count, size);
}

export async function getProduto(slug) {
  const { data } = await supabase.from('produtos').select('*, categoria:categorias(nome), marca:marcas(nome)').eq('slug', slug).single();
  return mapItem(data);
}

export async function getProdutosRelacionados(slug) {
  const current = await getProduto(slug);
  if (!current?.categoria_id) return [];
  const { data } = await supabase.from('produtos').select('*').eq('categoria_id', current.categoria_id).neq('slug', slug).limit(4);
  return mapList(data);
}

export async function buscarProdutos(q, page = 0, size = 12) {
  const { data, count } = await supabase.from('produtos')
    .select('*', { count: 'exact' })
    .ilike('nome', `%${q}%`)
    .range(page * size, (page + 1) * size - 1);
  return formatPagination(data, count, size);
}

export async function getProdutosDestaques() {
  const { data } = await supabase.from('produtos').select('*').limit(8);
  return mapList(data);
}

// ====== Aeronaves ======
export async function getAeronaves({ page = 0, size = 12, categoriaId } = {}) {
  let query = supabase.from('aeronaves').select('*', { count: 'exact' });
  if (categoriaId) query = query.eq('categoria_id', categoriaId);
  
  const { data, count, error } = await query
    .eq('status', 'DISPONIVEL')
    .range(page * size, (page + 1) * size - 1)
    .order('created_at', { ascending: false });
    
  if (error) console.error(error);
  return formatPagination(data, count, size);
}

export async function getAeronave(slug) {
  const { data } = await supabase.from('aeronaves').select('*, categoria:categorias(nome)').eq('slug', slug).single();
  return mapItem(data);
}

export async function getAeronavesRelacionadas(slug) {
  const current = await getAeronave(slug);
  if (!current?.categoria_id) return [];
  const { data } = await supabase.from('aeronaves').select('*').eq('categoria_id', current.categoria_id).neq('slug', slug).limit(4);
  return mapList(data);
}


// ====== Categorias ======
export async function getCategorias(tipo) {
  let q = supabase.from('categorias').select('*').order('ordem', { ascending: true });
  if (tipo) q = q.eq('tipo', tipo);
  const { data } = await q;
  return data || [];
}

// ====== Marcas ======
export async function getMarcas() {
  const { data } = await supabase.from('marcas').select('*').order('nome', { ascending: true });
  return data || [];
}

// ====== Configurações ======
export async function getConfiguracoes() {
  const { data } = await supabase.from('configuracoes').select('*');
  if(!data) return {};
  // Mapear para objeto chave: valor igual o java
  const configObj = {};
  data.forEach(c => { configObj[c.chave] = c.valor; });
  return configObj;
}

// ====== Slides ======
export async function getSlides() {
  const { data } = await supabase.from('slides').select('*').eq('ativo', true).order('ordem', { ascending: true });
  return data || [];
}

// ====== Contato ======
export async function enviarContato(formData) {
  const { error } = await supabase.from('contatos').insert({
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone || null,
    mensagem: formData.mensagem,
    tipo: formData.tipo || 'CONTATO',
  });
  if (error) throw new Error(error.message);
  return { success: true };
}
