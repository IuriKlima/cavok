import { getAeronave, getAeronavesRelacionadas } from '@/lib/api';
import ClientAeronave from './ClientAeronave';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const aeronave = await getAeronave(resolvedParams.slug);
  
  if (!aeronave) {
    return {
      title: 'Aeronave não encontrada | Cavok Avionics',
    };
  }

  const titulo = `${aeronave.nome} à venda | Cavok Avionics`;
  const desc = aeronave.descricaoCurta || `Compre aeronave ${aeronave.nome} na Cavok Avionics. Documentação em dia e inspeção disponível.`;

  return {
    title: titulo,
    description: desc,
    keywords: `${aeronave.nome}, aeronave à venda, comprar aeronave, cavok aeronaves, aviação, ${aeronave.marca?.nome || ''}`,
    openGraph: {
      title: titulo,
      description: desc,
      images: aeronave.imagemPrincipal ? [{ url: aeronave.imagemPrincipal, width: 800, height: 600 }] : [],
      type: 'product',
    },
  };
}

export default async function AeronaveDetalhe({ params }) {
  const resolvedParams = await params;
  const aeronave = await getAeronave(resolvedParams.slug);
  
  if (!aeronave) {
    notFound();
  }

  const relacionadas = await getAeronavesRelacionadas(resolvedParams.slug);

  return <ClientAeronave aeronave={aeronave} relacionadas={relacionadas} />;
}
