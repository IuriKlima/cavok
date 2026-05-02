import { getProduto, getProdutosRelacionados } from '@/lib/api';
import ClientProduct from './ClientProduct';
import { notFound } from 'next/navigation';

// Força geração dinâmica ou revalidação se necessário
export const revalidate = 3600; // revalida a cada hora

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const produto = await getProduto(resolvedParams.slug);
  
  if (!produto) {
    return {
      title: 'Produto não encontrado | Cavok Avionics',
    };
  }

  return {
    title: `${produto.nome} | Cavok Avionics`,
    description: produto.descricaoCurta || `Compre ${produto.nome} na Cavok Avionics. Aviônicos novos e seminovos com garantia.`,
    keywords: `${produto.nome}, ${produto.marca?.nome || ''}, aviônicos, comprar aviônicos, cavok avionics`,
    openGraph: {
      title: `${produto.nome} | Cavok Avionics`,
      description: produto.descricaoCurta || `Compre ${produto.nome} na Cavok Avionics.`,
      images: produto.imagemPrincipal ? [{ url: produto.imagemPrincipal, width: 800, height: 600 }] : [],
      type: 'website',
    },
  };
}

export default async function ProdutoDetalhe({ params }) {
  const resolvedParams = await params;
  const produto = await getProduto(resolvedParams.slug);
  
  if (!produto) {
    notFound();
  }

  const relacionados = await getProdutosRelacionados(resolvedParams.slug);

  return <ClientProduct produto={produto} relacionados={relacionados} />;
}
