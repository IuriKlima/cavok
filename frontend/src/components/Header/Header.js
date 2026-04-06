'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSiteData } from '@/context/SiteContext';
import { Phone, Mail, MessageCircle, Menu, X, Search, ChevronDown, Plane, PlaneTakeoff } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { categoriasProduto = [], config = {} } = useSiteData();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/avionicos?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const mainCats = categoriasProduto.slice(0, 6);
  const moreCats = categoriasProduto.slice(6);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topLinks}>
            <Link href="/avionicos" className={styles.topLinkActive}><Plane size={14} className={styles.iconSpaced} /> Aviônicos</Link>
            <Link href="/aeronaves" className={styles.topLinkAccent}><PlaneTakeoff size={14} className={styles.iconSpaced} /> Aeronaves à venda</Link>
          </div>
          <div className={styles.topContact}>
            <a href={`tel:+55${config.whatsapp || '19983296170'}`}><Phone size={14} className={styles.iconSpaced}/> {config.telefone || '(19) 98329-6170'}</a>
            <a href={`mailto:${config.email || 'orcamento@cavokavionics.com.br'}`}><Mail size={14} className={styles.iconSpaced}/> {config.email || 'orcamento@cavokavionics.com.br'}</a>
          </div>
        </div>
      </div>

      <div className={styles.mainHeader}>
        <div className={`container ${styles.mainHeaderInner}`}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                <path d="M20 0L40 24H30L20 12L10 24H0L20 0Z" fill="var(--accent)"/>
                <path d="M10 28H30V32H10V28Z" fill="var(--primary)"/>
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>CAVOK</span>
              <span className={styles.logoSub}>AVIONICS</span>
            </div>
          </Link>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input type="text" placeholder="Procure por produtos..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <button type="submit" className={styles.searchBtn}><Search size={18} /></button>
          </form>

          <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav className={`${styles.catNav} ${menuOpen ? styles.catNavOpen : ''}`}>
        <div className={`container ${styles.catNavInner}`}>
          {mainCats.map((cat) => (
            <Link key={cat.slug} href={`/avionicos?categoria=${cat.slug}`} className={styles.catLink}>
              {cat.nome}
            </Link>
          ))}
          {moreCats.length > 0 && (
            <div className={styles.catDropdown}>
              <span className={styles.catLink}>Outros <ChevronDown size={14} style={{marginLeft: '4px', verticalAlign: 'middle'}}/></span>
              <div className={styles.catDropdownMenu}>
                {moreCats.map((cat) => (
                  <Link key={cat.slug} href={`/avionicos?categoria=${cat.slug}`}>{cat.nome}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
