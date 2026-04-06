const API_URL = '';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      console.error(`API error: ${res.status} on ${endpoint}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`API fetch failed for ${endpoint}:`, error.message);
    return null;
  }
}

// ====== Produtos ======
export async function getProdutos({ page = 0, size = 12, categoriaId, marcaId } = {}) {
  const params = new URLSearchParams({ page, size });
  if (categoriaId) params.append('categoriaId', categoriaId);
  if (marcaId) params.append('marcaId', marcaId);
  return fetchApi(`/api/produtos?${params}`);
}

export async function getProduto(slug) {
  return fetchApi(`/api/produtos/${slug}`);
}

export async function buscarProdutos(q, page = 0) {
  return fetchApi(`/api/produtos/busca?q=${encodeURIComponent(q)}&page=${page}`);
}

export async function getProdutosDestaques() {
  return fetchApi('/api/produtos/destaques');
}

// ====== Aeronaves ======
export async function getAeronaves({ page = 0, size = 12, categoriaId } = {}) {
  const params = new URLSearchParams({ page, size });
  if (categoriaId) params.append('categoriaId', categoriaId);
  return fetchApi(`/api/aeronaves?${params}`);
}

export async function getAeronave(slug) {
  return fetchApi(`/api/aeronaves/${slug}`);
}

// ====== Categorias ======
export async function getCategorias(tipo) {
  const params = tipo ? `?tipo=${tipo}` : '';
  return fetchApi(`/api/categorias${params}`);
}

// ====== Marcas ======
export async function getMarcas() {
  return fetchApi('/api/marcas');
}

// ====== Configurações ======
export async function getConfiguracoes() {
  return fetchApi('/api/configuracoes');
}

// ====== Contato ======
export async function enviarContato(data) {
  return fetchApi('/api/contato', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
