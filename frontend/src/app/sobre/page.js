'use client';
import { useSiteData } from '@/context/SiteContext';
import { Target, Eye, Gem, Phone, MessageCircle } from 'lucide-react';
import styles from './page.module.css';

export default function SobrePage() {
  const { config = {} } = useSiteData();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{config.sobre_titulo || 'Sobre a Cavok Avionics'}</h1>
          <p className={styles.heroDesc}>Conheça nossa história e valores</p>
        </div>
      </section>
      <div className={`container ${styles.content}`}>
        <div className={styles.textBlock}>
          <p>{config.sobre_texto || 'A Cavok Avionics atua com venda de aviônicos e aeronaves, oferecendo produtos de qualidade com procedência garantida.'}</p>
        </div>
        <div className={styles.values}>
          <div className={styles.valueCard}><span className={styles.valueIcon}><Target size={40} color="var(--accent)"/></span><h3>Missão</h3><p>Oferecer aviônicos e aeronaves com qualidade, transparência e o melhor atendimento.</p></div>
          <div className={styles.valueCard}><span className={styles.valueIcon}><Eye size={40} color="var(--accent)"/></span><h3>Visão</h3><p>Ser referência nacional em venda de aviônicos e aeronaves.</p></div>
          <div className={styles.valueCard}><span className={styles.valueIcon}><Gem size={40} color="var(--accent)"/></span><h3>Valores</h3><p>Transparência, qualidade, compromisso com o cliente e paixão pela aviação.</p></div>
        </div>
        <div className={styles.contact}>
          <h2>Fale conosco</h2>
          <p>Entre em contato para saber mais.</p>
          <div className={styles.contactLinks}>
            <a href={`tel:+55${config.whatsapp || '19983296170'}`} className="btn btn-outline" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Phone size={18}/> {config.telefone || '(19) 98329-6170'}</a>
            <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener" className="btn btn-accent" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MessageCircle size={18}/> WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
