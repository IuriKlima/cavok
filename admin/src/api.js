import { supabase } from './supabase';

export function getToken() {
  const session = supabase.auth.getSession();
  return session?.access_token || localStorage.getItem('sb-ynpzkzkypusjxwdfpaxv-auth-token');
}

export function removeToken() {
  supabase.auth.signOut();
}

export function getUser() {
  const u = localStorage.getItem('cavok_user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user) {
  localStorage.setItem('cavok_user', JSON.stringify(user));
}

// Auth
export const login = async (email, senha) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error(error.message);
  // Determina a role baseado no email
  const role = email.toLowerCase().startsWith('aeronaves@') ? 'AERONAVES' : 'ADMIN';
  const userData = { ...data.user, role };
  setUser(userData);
  return { token: data.session.access_token, nome: data.user.email, email: data.user.email, role };
};

// =============================================
// Mapeamento camelCase <-> snake_case
// =============================================

export const generateSlug = (text) => text ? text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '') : undefined;

// Converte payload do form (camelCase) para colunas do Supabase (snake_case)
function produtoToSnake(form) {
  return {
    nome: form.nome,
    slug: form.slug ? generateSlug(form.slug) : generateSlug(form.nome),
    sku: form.sku || null,
    descricao: form.descricao || null,
    descricao_curta: form.descricaoCurta || null,
    preco: form.preco ? Number(form.preco) : null,
    categoria_id: form.categoriaId || null,
    marca_id: form.marcaId || null,
    condicao: form.condicao || null,
    status: form.status || 'ATIVO',
    destaque: form.destaque || false,
    homologado: form.homologado || false,
    imagem_url: form.imagemPrincipal || null,
    imagens: form.imagens || [],
  };
}

// Converte dados do Supabase (snake_case) para o form (camelCase)
function produtoFromSnake(data) {
  if (!data) return null;
  return {
    ...data,
    descricaoCurta: data.descricao_curta || '',
    categoriaId: data.categoria_id || '',
    marcaId: data.marca_id || '',
    imagemPrincipal: data.imagem_url || '',
    imagens: data.imagens || [],
  };
}

function aeronaveToSnake(form) {
  return {
    nome: form.nome,
    slug: form.slug ? generateSlug(form.slug) : generateSlug(form.nome),
    descricao: form.descricao || null,
    assentos: form.assentos || null,
    horas_celula: form.horasCelula || null,
    ano_fabricacao: form.anoFabricacao || null,
    especificacoes: form.especificacoes || null,
    preco: form.preco ? Number(form.preco) : null,
    categoria_id: form.categoriaId || null,
    status: form.status || 'DISPONIVEL',
    destaque: form.destaque || false,
    imagem_url: form.imagemPrincipal || null,
    imagens: form.imagens || [],
  };
}

function aeronaveFromSnake(data) {
  if (!data) return null;
  return {
    ...data,
    horasCelula: data.horas_celula || '',
    anoFabricacao: data.ano_fabricacao || '',
    categoriaId: data.categoria_id || '',
    imagemPrincipal: data.imagem_url || '',
    imagens: data.imagens || [],
  };
}

// Dashboard
export const getDashboard = async () => {
    const user = getUser();
    const isAero = user?.role === 'AERONAVES';

    const p = await supabase.from('produtos').select('id', { count: 'exact' });
    const a = await supabase.from('aeronaves').select('id', { count: 'exact' });
    const c = await supabase.from('categorias').select('id', { count: 'exact' });
    
    let msgQuery = supabase.from('contatos').select('id', { count: 'exact' }).eq('lido', false);
    if (isAero) {
      msgQuery = msgQuery.eq('tipo', 'AERONAVE');
    }
    const msg = await msgQuery;

    return { 
      totalProdutos: isAero ? 0 : (p.count || 0), 
      totalAeronaves: a.count || 0,
      totalCategorias: isAero ? 0 : (c.count || 0),
      contatosNaoLidos: msg.count || 0
    };
};

function formatPagination(data, count) {
  return { content: data, totalElements: count, totalPages: Math.ceil((count || 0) / 20) };
}

// Produtos
export const getProdutos = async (page = 0, size = 20, q = '') => {
  let query = supabase.from('produtos').select(`*, categoria:categorias(nome)`, { count: 'exact' });
  if (q) query = query.ilike('nome', `%${q}%`);
  const { data, count, error } = await query.range(page * size, (page + 1) * size - 1);
  if (error) throw new Error(error.message);
  return formatPagination(data, count);
};
export const getProduto = async (id) => {
  const { data } = await supabase.from('produtos').select('*').eq('id', id).single();
  return produtoFromSnake(data);
};
export const criarProduto = async (formData) => {
  const payload = produtoToSnake(formData);
  const { error } = await supabase.from('produtos').insert(payload);
  if (error) throw new Error(error.message);
};
export const atualizarProduto = async (id, formData) => {
  const payload = produtoToSnake(formData);
  const { error } = await supabase.from('produtos').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
};
export const deletarProduto = async (id) => await supabase.from('produtos').delete().eq('id', id);

// Aeronaves
export const getAeronaves = async (page = 0, size = 20) => {
  const { data, count, error } = await supabase.from('aeronaves').select('*', { count: 'exact' }).range(page * size, (page + 1) * size - 1);
  if (error) throw new Error(error.message);
  return formatPagination(data, count);
};
export const getAeronave = async (id) => {
  const { data } = await supabase.from('aeronaves').select('*').eq('id', id).single();
  return aeronaveFromSnake(data);
};
export const criarAeronave = async (formData) => {
  const payload = aeronaveToSnake(formData);
  const { error } = await supabase.from('aeronaves').insert(payload);
  if (error) throw new Error(error.message);
};
export const atualizarAeronave = async (id, formData) => {
  const payload = aeronaveToSnake(formData);
  const { error } = await supabase.from('aeronaves').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
};
export const deletarAeronave = async (id) => await supabase.from('aeronaves').delete().eq('id', id);

// Categorias
export const getCategorias = async (tipo) => {
  let q = supabase.from('categorias').select('*');
  if (tipo) q = q.eq('tipo', tipo);
  const { data } = await q;
  return data;
};
export const criarCategoria = async (data) => await supabase.from('categorias').insert(data);
export const atualizarCategoria = async (id, data) => await supabase.from('categorias').update(data).eq('id', id);
export const deletarCategoria = async (id) => await supabase.from('categorias').delete().eq('id', id);

// Configurações e slides
export const getConfiguracoes = async () => (await supabase.from('configuracoes').select('*')).data;
export const atualizarConfiguracoes = async (data) => {
    // Inclui o id no payload para que o upsert funcione corretamente
    const { data: result, error } = await supabase
      .from('configuracoes')
      .upsert(data, { onConflict: 'chave' })
      .select();
    if (error) throw new Error(error.message);
    return result;
};
export const getSlides = async () => {
    const { data, error } = await supabase.from('slides').select('*').order('ordem', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
};
export const criarSlide = async (data) => {
    const { error } = await supabase.from('slides').insert(data);
    if (error) throw new Error(error.message);
};
export const atualizarSlide = async (id, data) => {
    const { error } = await supabase.from('slides').update(data).eq('id', id);
    if (error) throw new Error(error.message);
};
export const deletarSlide = async (id) => {
    const { error } = await supabase.from('slides').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Uploads Supabase Storage Native File
export const uploadFiles = async (files) => {
  const urls = [];
  for (const file of files) {
      const fileName = Date.now() + '_' + file.name;
      const { data, error } = await supabase.storage.from('public-images').upload(fileName, file);
      if (error) throw new Error(error.message);
      urls.push(supabase.storage.from('public-images').getPublicUrl(fileName).data.publicUrl);
  }
  return { urls };
};

// Contatos (Formulário do site público)
export const getContatos = async () => {
  const user = getUser();
  const isAero = user?.role === 'AERONAVES';

  let query = supabase.from('contatos').select('*').order('created_at', { ascending: false });
  if (isAero) {
    query = query.eq('tipo', 'AERONAVE');
  }

  const { data } = await query;
  return data || [];
};
export const marcarContatoLido = async (id) => {
  const { error } = await supabase.from('contatos').update({ lido: true }).eq('id', id);
  if (error) throw new Error(error.message);
};
export const deletarContato = async (id) => {
  const { error } = await supabase.from('contatos').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// Legacy Exports (Para compilação do Vite de telas antigas descontinuadas)
export const setToken = (t) => {}; 
export const getPaginas = async () => ({ content: [], totalElements: 0, totalPages: 0 });
export const criarPagina = async () => {};
export const atualizarPagina = async () => {};
export const deletarPagina = async () => {};
export const importarXml = async () => {};
