import { getProdutos, getAeronaves } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = 'https://cavokavionics.com.br';

  // Busca todos os produtos (até 1000 para SEO)
  const produtosRes = await getProdutos({ size: 1000 });
  const produtos = produtosRes.content || [];

  // Busca todas as aeronaves
  const aeronavesRes = await getAeronaves({ size: 1000 });
  const aeronaves = aeronavesRes.content || [];

  const rotasDinamicasProdutos = produtos.map((p) => ({
    url: `${baseUrl}/avionicos/${p.slug}`,
    lastModified: p.updated_at || p.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const rotasDinamicasAeronaves = aeronaves.map((a) => ({
    url: `${baseUrl}/aeronaves/${a.slug}`,
    lastModified: a.updated_at || a.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const rotasEstaticas = [
    '',
    '/sobre',
    '/contato',
    '/avionicos',
    '/aeronaves',
    '/orcamento'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.7,
  }));

  return [...rotasEstaticas, ...rotasDinamicasProdutos, ...rotasDinamicasAeronaves];
}
