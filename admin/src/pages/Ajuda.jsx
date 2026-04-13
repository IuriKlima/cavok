import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Plane, FolderTree, Image, MessageSquare,
  Settings, HelpCircle, ArrowRight, Shield, Globe, Users, Upload, FileText
} from 'lucide-react';

const sections = [
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Dashboard',
    color: '#3b82f6',
    desc: 'Painel inicial que mostra um resumo rápido do sistema.',
    details: [
      'Exibe o total de Produtos Aviônicos cadastrados no catálogo.',
      'Exibe o total de Aeronaves à Venda disponíveis.',
      'Mostra o número de Categorias ativas (Aviônicos e Aeronaves).',
      'Contabiliza o número de Contatos/Mensagens não lidas recebidas pelo site.',
      'Para o Admin de Aeronaves, mostra apenas os dados relevantes ao setor de aeronaves.',
    ],
  },
  {
    icon: <ShoppingCart size={24} />,
    title: 'Produtos (Aviônicos)',
    color: '#E14D2A',
    desc: 'Gerenciamento completo do catálogo de aviônicos do site.',
    details: [
      'Listar todos os produtos com busca por nome.',
      'Criar novo produto com nome, descrição, preço, SKU, imagens e categoria.',
      'Editar qualquer campo de um produto existente.',
      'Fazer upload de imagem principal e imagens adicionais.',
      'Marcar um produto como "Destaque" para destaque na página inicial.',
      'Definir condição: Novo, Seminovo ou Recondicionado.',
      'Marcar como "Homologado" (selo de certificação).',
      'Deletar produtos desnecessários.',
    ],
    adminOnly: true,
  },
  {
    icon: <Plane size={24} />,
    title: 'Aeronaves',
    color: '#0ea5e9',
    desc: 'Cadastro e gestão das aeronaves à venda no site.',
    details: [
      'Listar todas as aeronaves com status (Disponível/Vendida).',
      'Criar nova aeronave com dados técnicos: assentos, horas de célula, ano de fabricação.',
      'Adicionar especificações técnicas em HTML formatado.',
      'Upload de imagem principal e galeria de fotos.',
      'Definir preço (em R$) e categoria da aeronave.',
      'Alterar status entre DISPONÍVEL e VENDIDA.',
      'Deletar aeronaves do catálogo.',
    ],
  },
  {
    icon: <FolderTree size={24} />,
    title: 'Categorias',
    color: '#8b5cf6',
    desc: 'Organização dos produtos e aeronaves em categorias.',
    details: [
      'Criar categorias do tipo "PRODUTO" (para aviônicos) ou "AERONAVE".',
      'Cada categoria gera um slug automático para URLs amigáveis.',
      'Definir a ordem de exibição no menu lateral do site.',
      'Editar nome e ordem de categorias existentes.',
      'Deletar categorias (atenção: produtos associados perdem a categoria).',
    ],
    adminOnly: true,
  },
  {
    icon: <Image size={24} />,
    title: 'Slides (Banner)',
    color: '#f59e0b',
    desc: 'Gerenciamento do carrossel de destaque na página inicial.',
    details: [
      'Criar slides com título, subtítulo e imagem de fundo.',
      'Definir um link de destino e o texto do botão CTA.',
      'Controlar a ordem de exibição dos slides.',
      'Ativar/desativar slides sem precisar deletá-los.',
      'Upload de imagem diretamente para o storage.',
    ],
    adminOnly: true,
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Contatos / Mensagens',
    color: '#22c55e',
    desc: 'Central de mensagens recebidas pelo site público.',
    details: [
      'Visualizar mensagens de três tipos: Contato Geral, Orçamento e Aeronave.',
      'Filtrar por tipo usando as abas no topo da página.',
      'Marcar mensagens como "Lida" para controle de atendimento.',
      'Ver dados completos: nome, email, telefone, mensagem e data.',
      'Deletar mensagens processadas.',
      'Admin de Aeronaves vê apenas mensagens do tipo "Aeronave".',
    ],
  },
  {
    icon: <Settings size={24} />,
    title: 'Config. Globais (Aviônicos)',
    color: '#1B4D7C',
    desc: 'Configurações gerais que afetam todo o site.',
    details: [
      'Telefone, Email e WhatsApp — exibidos no rodapé, página de contato e botão flutuante.',
      'Nome e Descrição do Site — usado em SEO e rodapé.',
      'Endereço — exibido na página de contato.',
      'Instagram e Facebook — links de redes sociais.',
      'Logo Aviônicos e Logo Aeronaves — logos do cabeçalho e rodapé.',
      'Textos do Hero (Home) — título e subtítulo da tela inicial.',
      'Textos de Sobre e Contato — títulos e descrições dessas páginas.',
    ],
    adminOnly: true,
  },
  {
    icon: <Settings size={24} />,
    title: 'Config. Aeronaves',
    color: '#0ea5e9',
    desc: 'Configurações exclusivas do setor de aeronaves.',
    details: [
      'Telefone de Aeronaves — número de contato específico para aeronaves.',
      'Email de Aeronaves — email que aparece no rodapé quando em /aeronaves.',
      'WhatsApp de Aeronaves — número do botão flutuante em páginas de aeronaves.',
      'Título e Subtítulo Hero — textos da página principal de aeronaves.',
      'Imagem Hero — banner de destaque na página de listagem de aeronaves.',
      'Essas configurações são detectadas automaticamente pelo site quando o visitante está na seção de aeronaves.',
    ],
  },
];

const siteFeatures = [
  { icon: <Globe size={20} />, title: 'Site Público', desc: 'O site que seus clientes veem: catálogo de aviônicos, aeronaves, contato e sobre.' },
  { icon: <Shield size={20} />, title: 'Segurança', desc: 'RLS do Supabase protege os dados. Admin de Aeronaves não acessa dados de Aviônicos.' },
  { icon: <Users size={20} />, title: 'Dois Perfis', desc: 'Admin Global vê tudo. Admin de Aeronaves vê apenas aeronaves e seus contatos.' },
  { icon: <Upload size={20} />, title: 'Uploads', desc: 'Imagens são armazenadas no Supabase Storage com limite de 5MB e validação de tipo.' },
];

export default function Ajuda() {
  const { user } = useAuth();
  const isAero = user?.role === 'AERONAVES';

  const visibleSections = isAero
    ? sections.filter(s => !s.adminOnly)
    : sections;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <HelpCircle size={28} /> Central de Ajuda
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: 4 }}>
            Guia completo de todas as funcionalidades do painel administrativo
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {siteFeatures.map((f, i) => (
          <div key={i} style={{
            padding: 20,
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: 'var(--primary-50, #e8f0f8)',
              color: 'var(--primary, #1B4D7C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{f.icon}</div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{f.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {visibleSections.map((section, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '20px 28px',
              background: `linear-gradient(135deg, ${section.color}10, ${section.color}05)`,
              borderBottom: `1px solid var(--border)`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: `${section.color}18`,
                color: section.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{section.icon}</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{section.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{section.desc}</p>
              </div>
            </div>
            <div style={{ padding: '20px 28px' }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.details.map((detail, j) => (
                  <li key={j} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    lineHeight: 1.55,
                  }}>
                    <ArrowRight size={14} style={{ color: section.color, marginTop: 4, flexShrink: 0 }} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 14,
        background: 'linear-gradient(135deg, var(--primary-50, #e8f0f8), #f0f4ff)',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <FileText size={24} style={{ color: 'var(--primary)', marginBottom: 8 }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Precisa de mais ajuda?</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: 500, margin: '0 auto' }}>
          Em caso de dúvidas técnicas sobre o painel, entre em contato com o suporte de desenvolvimento da plataforma Cavok.
        </p>
      </div>
    </div>
  );
}
