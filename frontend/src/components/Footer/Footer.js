'use client';
import Link from 'next/link';
import { useSiteData } from '@/context/SiteContext';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const { categoriasProduto = [], config = {} } = useSiteData();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerCol}>
          <div className={styles.footerLogo}>
            <span className={styles.logoName}>CAVOK</span>
            <span className={styles.logoSub}>AVIONICS</span>
          </div>
          <p className={styles.footerDesc}>
            {config.site_descricao || 'Sua parceira completa em aviação. Oferecemos aviônicos e aeronaves novas e seminovas.'}
          </p>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Links Úteis</h4>
          <nav className={styles.footerNav}>
            <Link href="/avionicos">Aviônicos</Link>
            <Link href="/aeronaves">Aeronaves à Venda</Link>
            <Link href="/sobre">Sobre Nós</Link>
            <Link href="/contato">Contato</Link>
          </nav>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Categorias</h4>
          <nav className={styles.footerNav}>
            {categoriasProduto.slice(0, 6).map(c => (
              <Link key={c.slug} href={`/avionicos?categoria=${c.slug}`}>{c.nome}</Link>
            ))}
          </nav>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Contato</h4>
          <div className={styles.contactInfo}>
            <a href={`tel:+55${config.whatsapp || '19983296170'}`}><Phone size={16} style={{marginRight: '8px', verticalAlign: 'middle'}}/> {config.telefone || '(19) 98329-6170'}</a>
            <a href={`mailto:${config.email || 'orcamento@cavokavionics.com.br'}`}><Mail size={16} style={{marginRight: '8px', verticalAlign: 'middle'}}/> {config.email || 'orcamento@cavokavionics.com.br'}</a>
            <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener"><MessageCircle size={16} style={{marginRight: '8px', verticalAlign: 'middle'}}/> WhatsApp</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} {config.site_nome || 'Cavok Avionics'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
