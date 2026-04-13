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
  setUser(data.user);
  return { token: data.session.access_token, nome: data.user.email, role: 'ADMIN' };
};

// Dashboard
export const getDashboard = async () => {
    const p = await supabase.from('produtos').select('id', { count: 'exact' });
    const a = await supabase.from('aeronaves').select('id', { count: 'exact' });
    return { countProdutos: p.count, countAeronaves: a.count };
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
export const getProduto = async (id) => (await supabase.from('produtos').select('*').eq('id', id).single()).data;
export const criarProduto = async (data) => await supabase.from('produtos').insert(data);
export const atualizarProduto = async (id, data) => await supabase.from('produtos').update(data).eq('id', id);
export const deletarProduto = async (id) => await supabase.from('produtos').delete().eq('id', id);

// Aeronaves
export const getAeronaves = async (page = 0, size = 20) => {
  const { data, count, error } = await supabase.from('aeronaves').select('*', { count: 'exact' }).range(page * size, (page + 1) * size - 1);
  if (error) throw new Error(error.message);
  return formatPagination(data, count);
};
export const getAeronave = async (id) => (await supabase.from('aeronaves').select('*').eq('id', id).single()).data;
export const criarAeronave = async (data) => await supabase.from('aeronaves').insert(data);
export const atualizarAeronave = async (id, data) => await supabase.from('aeronaves').update(data).eq('id', id);
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
    // Para array de atualizações em massa pelas chaves
    const { data: result, error } = await supabase.from('configuracoes').upsert(data, { onConflict: 'chave' }).select();
    if (error) throw new Error(error.message);
    return result;
};
export const getSlides = async () => (await supabase.from('slides').select('*')).data;
export const criarSlide = async (data) => await supabase.from('slides').insert(data);
export const atualizarSlide = async (id, data) => await supabase.from('slides').update(data).eq('id', id);
export const deletarSlide = async (id) => await supabase.from('slides').delete().eq('id', id);

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

// Legacy Exports (Para compilação do Vite de telas antigas descontinuadas)
export const setToken = (t) => {}; 
export const getPaginas = async () => ({ content: [], totalElements: 0, totalPages: 0 });
export const criarPagina = async () => {};
export const atualizarPagina = async () => {};
export const deletarPagina = async () => {};
