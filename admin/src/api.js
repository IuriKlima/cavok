const API_URL = '';

function getToken() {
  return localStorage.getItem('cavok_token');
}

export function setToken(token) {
  localStorage.setItem('cavok_token', token);
}

export function removeToken() {
  localStorage.removeItem('cavok_token');
}

export function getUser() {
  const u = localStorage.getItem('cavok_user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user) {
  localStorage.setItem('cavok_user', JSON.stringify(user));
}

async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || err.message || `Erro ${res.status}`);
  }

  return res.json();
}

// Auth
export const login = (email, senha) => api('/api/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });

// Dashboard
export const getDashboard = () => api('/api/admin/dashboard');

// Produtos
export const getProdutos = (page = 0, size = 20, q = '') => api(`/api/admin/produtos?page=${page}&size=${size}${q ? `&q=${encodeURIComponent(q)}` : ''}`);
export const getProduto = (id) => api(`/api/admin/produtos/${id}`);
export const criarProduto = (data) => api('/api/admin/produtos', { method: 'POST', body: JSON.stringify(data) });
export const atualizarProduto = (id, data) => api(`/api/admin/produtos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletarProduto = (id) => api(`/api/admin/produtos/${id}`, { method: 'DELETE' });

// Aeronaves
export const getAeronaves = (page = 0, size = 20) => api(`/api/admin/aeronaves?page=${page}&size=${size}`);
export const getAeronave = (id) => api(`/api/admin/aeronaves/${id}`);
export const criarAeronave = (data) => api('/api/admin/aeronaves', { method: 'POST', body: JSON.stringify(data) });
export const atualizarAeronave = (id, data) => api(`/api/admin/aeronaves/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletarAeronave = (id) => api(`/api/admin/aeronaves/${id}`, { method: 'DELETE' });

// Categorias
export const getCategorias = (tipo) => api(`/api/admin/categorias${tipo ? `?tipo=${tipo}` : ''}`);
export const criarCategoria = (data) => api('/api/admin/categorias', { method: 'POST', body: JSON.stringify(data) });
export const atualizarCategoria = (id, data) => api(`/api/admin/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletarCategoria = (id) => api(`/api/admin/categorias/${id}`, { method: 'DELETE' });

// Páginas
export const getPaginas = () => api('/api/admin/paginas');
export const getPagina = (id) => api(`/api/admin/paginas/${id}`);
export const criarPagina = (data) => api('/api/admin/paginas', { method: 'POST', body: JSON.stringify(data) });
export const atualizarPagina = (id, data) => api(`/api/admin/paginas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletarPagina = (id) => api(`/api/admin/paginas/${id}`, { method: 'DELETE' });

// Configurações
export const getConfiguracoes = () => api('/api/admin/configuracoes');
export const atualizarConfiguracoes = (data) => api('/api/admin/configuracoes', { method: 'PUT', body: JSON.stringify(data) });

// Contatos
export const getContatos = (page = 0, size = 20) => api(`/api/admin/contatos?page=${page}&size=${size}`);
export const marcarContatoLido = (id) => api(`/api/admin/contatos/${id}/lido`, { method: 'PUT' });
export const deletarContato = (id) => api(`/api/admin/contatos/${id}`, { method: 'DELETE' });

// Upload
export const uploadFiles = (files) => {
  const formData = new FormData();
  for (const file of files) formData.append('files', file);
  return api('/api/admin/upload', { method: 'POST', body: formData });
};

// Import XML
export const importarXml = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api('/api/admin/import/xml', { method: 'POST', body: formData });
};
