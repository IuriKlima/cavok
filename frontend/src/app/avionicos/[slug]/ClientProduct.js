'use client';

import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Camera, CheckCircle, ShoppingCart, Check, Mail, ShieldCheck, Truck, Wrench } from 'lucide-react';
import styles from './page.module.css';

export default function ClientProduct({ produto, relacionados }) {
  const { addToCart, cartItems } = useCart();

  if (!produto) return <div style={{ padding: '100px', textAlign: 'center' }}>Produto não encontrado.</div>;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": produto.nome,
    "image": produto.imagemPrincipal ? [produto.imagemPrincipal] : [],
    "description": produto.descricaoCurta || produto.nome,
    "sku": produto.sku || produto.id,
    "brand": {
      "@type": "Brand",
      "name": produto.marca?.nome || "Cavok Avionics"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cavokavionics.com.br/avionicos/${produto.slug}`,
      "priceCurrency": "BRL",
      "price": produto.preco || "0.00",
      "itemCondition": produto.condicao === 'NOVO' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/avionicos">Aviônicos</Link>
          <span>/</span>
          {produto.categoria && (
            <>
              <Link href={`/avionicos?categoria=${produto.categoria.slug}`}>{produto.categoria.nome}</Link>
              <span>/</span>
            </>
          )}
          <strong>{produto.nome}</strong>
        </div>

        <div className={styles.productLayout}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {produto.imagemPrincipal ? (
                <img src={produto.imagemPrincipal} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span><Camera size={48} color="rgba(0,0,0,0.2)"/></span>
                  <p>Imagem do produto</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.badges}>
              {produto.homologado && <span className="badge badge-success" style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><CheckCircle size={14}/> Homologado</span>}
              {produto.condicao && <span className="badge badge-primary">{produto.condicao}</span>}
            </div>

            {produto.marca && <span className={styles.brand}>{produto.marca.nome}</span>}
            <h1 className={styles.productName}>{produto.nome}</h1>
            {produto.sku && <span className={styles.sku}>SKU: {produto.sku}</span>}

            <div className={styles.priceBox}>
              {produto.preco ? (
                <span className={styles.price}>
                  R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              ) : (
                <span className={styles.consulte}>Preço sob consulta</span>
              )}
            </div>

            <div className={styles.actions}>
              {cartItems.some(i => i.id === produto.id) ? (
                <Link href="/orcamento" className="btn btn-success btn-lg" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Check size={20}/> Ver no Orçamento
                </Link>
              ) : (
                <button
                  onClick={() => addToCart(produto)}
                  className="btn btn-accent btn-lg"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ShoppingCart size={20}/> Adicionar ao Orçamento
                </button>
              )}
              <Link href="/contato" className="btn btn-outline btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Mail size={20}/> Contato
              </Link>
            </div>

            <div className={styles.features}>
              <div className={styles.featureItem}><ShieldCheck size={18} color="var(--accent)"/> Garantia inclusa</div>
              <div className={styles.featureItem}><Truck size={18} color="var(--accent)"/> Envio para todo Brasil</div>
              <div className={styles.featureItem}><Wrench size={18} color="var(--accent)"/> Suporte técnico</div>
            </div>
          </div>
        </div>

        {produto.descricao && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Descrição do Produto</h2>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: sanitizeHtml(produto.descricao) }} />
          </div>
        )}

        {relacionados && relacionados.length > 0 && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Produtos Relacionados</h2>
            <div className="grid grid-4" style={{ gap: 20, marginTop: 20 }}>
              {relacionados.map(p => <ProductCard key={p.id} produto={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
