import Link from 'next/link';
import { CheckCircle, Star } from 'lucide-react';
import styles from './ProductCard.module.css';

export default function ProductCard({ produto }) {
  const imageUrl = produto.imagemPrincipal || '/placeholder-product.jpg';
  
  return (
    <Link href={`/avionicos/${produto.slug}`} className={`card ${styles.productCard}`}>
      <div className={styles.imageWrap}>
        <img
          src={imageUrl}
          alt={produto.nome}
          className={styles.image}
          loading="lazy"
        />
        {produto.homologado && (
          <span className={`badge badge-success ${styles.badge}`} style={{display: 'flex', alignItems: 'center', gap: '4px'}}><CheckCircle size={12}/> Homologado</span>
        )}
        {produto.destaque && (
          <span className={`badge badge-accent ${styles.badgeDestaque}`} style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Star size={12}/> Destaque</span>
        )}
      </div>
      <div className={styles.info}>
        {produto.categoria && (
          <span className={styles.category}>{produto.categoria.nome}</span>
        )}
        <h3 className={styles.name}>{produto.nome}</h3>
        {produto.sku && (
          <span className={styles.sku}>SKU: {produto.sku}</span>
        )}
        <div className={styles.footer}>
          {produto.preco ? (
            <span className={styles.price}>
              R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          ) : (
            <span className={styles.consulte}>Consulte preço</span>
          )}
          <span className={styles.cta}>Ver detalhes →</span>
        </div>
      </div>
    </Link>
  );
}
