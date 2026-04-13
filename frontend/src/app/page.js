'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard/ProductCard';
import HeroSlider from '@/components/HeroSlider/HeroSlider';
import { useSiteData } from '@/context/SiteContext';
import { getProdutos, getAeronaves } from '@/lib/api';
import { Plane, ShieldCheck, Truck, Wrench, CheckCircle, PlaneTakeoff, MessageCircle, Mail } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const { config = {}, slides = [] } = useSiteData();
  const [produtos, setProdutos] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);

  useEffect(() => {
    getProdutos({ size: 8 }).then(d => { if (d) setProdutos(d.content || []); });
    getAeronaves({ size: 4 }).then(d => { if (d) setAeronaves(d.content || []); });
  }, []);

  return (
    <>
      <HeroSlider slides={slides} config={config} />

      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}><span><ShieldCheck size={32} color="var(--accent)"/></span><h3>Garantia</h3><p>Em todos os produtos</p></div>
            <div className={styles.trustItem}><span><Truck size={32} color="var(--accent)"/></span><h3>Envio Nacional</h3><p>Para todo o Brasil</p></div>
            <div className={styles.trustItem}><span><Wrench size={32} color="var(--accent)"/></span><h3>Suporte Técnico</h3><p>Equipe especializada</p></div>
            <div className={styles.trustItem}><span><CheckCircle size={32} color="var(--accent)"/></span><h3>Homologados</h3><p>Produtos certificados</p></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Aviônicos em Destaque</h2>
            <Link href="/avionicos" className={styles.sectionLink}>Ver todos →</Link>
          </div>
          <div className={styles.productsGrid}>
            {produtos.length > 0 ? produtos.map(p => (
              <ProductCard key={p.id} produto={p} />
            )) : Array.from({length: 4}).map((_, i) => (
              <div key={i} className={styles.skeleton}></div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><PlaneTakeoff size={28} color="var(--accent)"/> Aeronaves à Venda</h2>
            <Link href="/aeronaves" className={styles.sectionLink}>Ver todas →</Link>
          </div>
          <div className={styles.aircraftGrid}>
            {aeronaves.map(a => (
              <Link key={a.id} href={`/aeronaves/${a.slug}`} className={styles.aircraftCard}>
                <div className={styles.aircraftImage}>
                  {a.imagemPrincipal ? <img src={a.imagemPrincipal} alt={a.nome} /> : <div className={styles.aircraftPlaceholder}><Plane size={48} color="rgba(255,255,255,0.2)"/></div>}
                </div>
                <div className={styles.aircraftInfo}>
                  <span className={styles.aircraftCategory}>{a.categoria?.nome || 'Aeronave'}</span>
                  <h3 className={styles.aircraftName}>{a.nome}</h3>
                  {a.anoFabricacao && <span className={styles.aircraftYear}>Ano: {a.anoFabricacao}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Precisa de um Orçamento?</h2>
          <p className={styles.ctaDesc}>Entre em contato conosco pelo WhatsApp ou formulário</p>
          <div className={styles.ctaActions}>
            <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener" className="btn btn-accent btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MessageCircle size={20}/> WhatsApp</a>
            <Link href="/contato" className="btn btn-outline btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={20}/> Formulário de Contato</Link>
          </div>
        </div>
      </section>
    </>
  );
}
