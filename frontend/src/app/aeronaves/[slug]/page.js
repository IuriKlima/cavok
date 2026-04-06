'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAeronave } from '@/lib/api';
import { Plane, CheckCircle, XCircle, MessageCircle, Mail, FileText, Search, Handshake } from 'lucide-react';
import styles from './page.module.css';

export default function AeronaveDetalhe() {
  const params = useParams();
  const slug = params.slug;
  const [aeronave, setAeronave] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAeronave(slug).then(data => {
      setAeronave(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Carregando...</div>;
  if (!aeronave) return <div style={{ padding: '100px', textAlign: 'center' }}>Aeronave não encontrada.</div>;

  const allImages = [aeronave.imagemPrincipal, ...(aeronave.imagens || [])].filter(Boolean);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/aeronaves">Aeronaves</Link>
          <span>/</span>
          <strong>{aeronave.nome}</strong>
        </div>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {allImages.length > 0 ? (
                <img src={allImages[activeImage]} alt={aeronave.nome} />
              ) : (
                <div className={styles.placeholder}><span><Plane size={48} color="rgba(0,0,0,0.2)"/></span><p>Imagem da aeronave</p></div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`} onClick={() => setActiveImage(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            {aeronave.categoria && <span className={styles.category}>{aeronave.categoria.nome}</span>}
            <h1 className={styles.name}>{aeronave.nome}</h1>

            <span className={`${styles.statusBadge} ${aeronave.status === 'DISPONIVEL' ? styles.statusOk : styles.statusSold}`} style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
              {aeronave.status === 'DISPONIVEL' ? <><CheckCircle size={14}/> Disponível</> : aeronave.status === 'VENDIDA' ? <><XCircle size={14}/> Vendida</> : aeronave.status}
            </span>

            <div className={styles.specs}>
              {aeronave.anoFabricacao && <div className={styles.spec}><span className={styles.specLabel}>Ano Fabricação</span><span className={styles.specValue}>{aeronave.anoFabricacao}</span></div>}
              {aeronave.assentos && <div className={styles.spec}><span className={styles.specLabel}>Assentos</span><span className={styles.specValue}>{aeronave.assentos}</span></div>}
              {aeronave.horasCelula && <div className={styles.spec}><span className={styles.specLabel}>Horas Célula</span><span className={styles.specValue}>{aeronave.horasCelula}</span></div>}
            </div>

            {aeronave.preco && (
              <div className={styles.priceBox}>
                <span className={styles.price}>R$ {Number(aeronave.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className={styles.actions}>
              <a href={`https://wa.me/5519983296170?text=Olá! Tenho interesse na aeronave: ${aeronave.nome}`} target="_blank" rel="noopener" className="btn btn-accent btn-lg" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MessageCircle size={20}/> Tenho Interesse
              </a>
              <Link href="/contato" className="btn btn-outline btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={20}/> Contato</Link>
            </div>

            <div className={styles.features}>
              <div className={styles.featureItem}><FileText size={18} color="var(--accent)"/> Documentação em dia</div>
              <div className={styles.featureItem}><Search size={18} color="var(--accent)"/> Inspeção disponível</div>
              <div className={styles.featureItem}><Handshake size={18} color="var(--accent)"/> Negociação facilitada</div>
            </div>
          </div>
        </div>

        {aeronave.descricao && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Sobre esta Aeronave</h2>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: aeronave.descricao }} />
          </div>
        )}

        {aeronave.especificacoes && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Especificações Técnicas</h2>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: aeronave.especificacoes }} />
          </div>
        )}
      </div>
    </div>
  );
}
