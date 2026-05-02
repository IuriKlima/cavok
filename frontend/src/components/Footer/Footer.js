'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteData } from '@/context/SiteContext';
import { Phone, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const { categoriasProduto = [], config = {} } = useSiteData();
  const pathname = usePathname();
  const isAeronaves = pathname.startsWith('/aeronaves');

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerCol}>
          <div className={styles.footerLogo}>
            {config.logo_avionicos ? (
              <img src={config.logo_avionicos} alt={config.site_nome || 'Cavok Avionics'} style={{ maxHeight: 40, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <>
                <span className={styles.logoName}>CAVOK</span>
                <span className={styles.logoSub}>AVIONICS</span>
              </>
            )}
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
            <a href={`tel:+55${isAeronaves ? config.aeronaves_whatsapp || config.whatsapp || '19983296170' : config.whatsapp || '19983296170'}`}>
              <Phone size={16} /> +55 {isAeronaves ? config.aeronaves_telefone || config.telefone || '(19) 98329-6170' : config.telefone || '(19) 98329-6170'}
            </a>
            <a href={`mailto:${isAeronaves ? config.aeronaves_email || config.email || 'orcamento@cavokavionics.com.br' : config.email || 'orcamento@cavokavionics.com.br'}`}>
              <Mail size={16} /> {isAeronaves ? config.aeronaves_email || config.email || 'orcamento@cavokavionics.com.br' : config.email || 'orcamento@cavokavionics.com.br'}
            </a>
            <a href={`https://wa.me/${isAeronaves ? config.aeronaves_whatsapp || config.whatsapp || '5519983296170' : config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p style={{marginBottom: '12px'}}>CAVOK AVIONICS INSTALACOES AERONAUTICAS LTDA - C.N.P.J.: 50.944.003/0001-51</p>
          <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--gray-400)'}}>
            <ShieldCheck size={32} color="var(--accent)" />
            <div style={{textAlign: 'left', lineHeight: '1.4'}}>
              <strong style={{display: 'block', color: 'var(--white)', fontSize: '0.9rem'}}>Certificado de Organização de Manutenção</strong>
              <span style={{fontSize: '0.8rem'}}>Emitido pela Agência Nacional de Aviação Civil (ANAC) - <strong>COM: 202408-02/ANAC</strong></span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} {config.site_nome || 'Cavok Avionics'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
