'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteData } from '@/context/SiteContext';
import { useCart } from '@/context/CartContext';
import { Phone, Mail, MessageCircle, Menu, X, Search, ChevronDown, Plane, PlaneTakeoff, ShoppingCart } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { categoriasProduto = [], categoriasAeronave = [], config = {} } = useSiteData();
  const { cartCount, loaded } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAeronaves = pathname.startsWith('/aeronaves');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAeronaves) {
        window.location.href = `/aeronaves?q=${encodeURIComponent(searchQuery.trim())}`;
      } else {
        window.location.href = `/avionicos?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    }
  };

  // Categorias de Aviônicos
  const avionicosMainCats = categoriasProduto.slice(0, 5);
  const avionicosMoreCats = categoriasProduto.slice(5);

  // Categorias de Aeronaves
  const aeronavesMainCats = categoriasAeronave.slice(0, 5);
  const aeronavesMoreCats = categoriasAeronave.slice(5);

  const logoSrc = isAeronaves ? config.logo_aeronaves : config.logo_avionicos;

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topLinks}>
            <Link href="/avionicos" className={!isAeronaves && pathname !== '/' ? styles.topLinkActive : styles.topLinkAccent} style={{ background: !isAeronaves && pathname !== '/' ? 'rgba(255,255,255,0.15)' : 'transparent' }}><Plane size={14} className={styles.iconSpaced} /> Aviônicos</Link>
            <Link href="/aeronaves" className={isAeronaves ? styles.topLinkActive : styles.topLinkAccent} style={{ background: isAeronaves ? 'rgba(255,255,255,0.15)' : 'transparent' }}><PlaneTakeoff size={14} className={styles.iconSpaced} /> Aeronaves à venda</Link>
          </div>
          <div className={styles.topContact}>
            <a href={`tel:+55${isAeronaves ? config.aeronaves_whatsapp || config.whatsapp || '19983296170' : config.whatsapp || '19983296170'}`}>
              <Phone size={14} className={styles.iconSpaced}/> +55 {isAeronaves ? config.aeronaves_telefone || config.telefone || '(19) 98329-6170' : config.telefone || '(19) 98329-6170'}
            </a>
            <a href={`mailto:${isAeronaves ? config.aeronaves_email || config.email || 'orcamento@cavokavionics.com.br' : config.email || 'orcamento@cavokavionics.com.br'}`}>
              <Mail size={14} className={styles.iconSpaced}/> {isAeronaves ? config.aeronaves_email || config.email || 'orcamento@cavokavionics.com.br' : config.email || 'orcamento@cavokavionics.com.br'}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.mainHeader}>
        <div className={`container ${styles.mainHeaderInner}`}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              {logoSrc ? (
                <img src={logoSrc} alt={config.site_nome || 'Cavok Avionics'} className={styles.logoImg} />
              ) : (
                <div className={styles.logoText}>
                  <span className={styles.logoName}>CAVOK</span>
                  <span className={styles.logoSub}>{isAeronaves ? 'AERONAVES' : 'AVIONICS'}</span>
                </div>
              )}
            </Link>
            <span className={styles.logoCert}>COM: 202408-02/ANAC</span>
          </div>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input type="text" placeholder={isAeronaves ? "Procure por aeronaves..." : "Procure por aviônicos..."} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
            <button type="submit" className={styles.searchBtn}><Search size={18} /></button>
          </form>

          {!isAeronaves && (
            <Link href="/orcamento" className={styles.cartIcon}>
              <ShoppingCart size={24} />
              {loaded && cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              <span className={styles.cartLabel}>Orçamentos</span>
            </Link>
          )}

          <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav className={`${styles.catNav} ${menuOpen ? styles.catNavOpen : ''}`}>
        <div className={`container ${styles.catNavInner}`}>
          {!isAeronaves ? (
            // ==================== NAV DE AVIÔNICOS ====================
            <>
              {avionicosMainCats.map((cat) => (
                <Link key={cat.slug} href={`/avionicos?categoria=${cat.slug}`} className={styles.catLink}>
                  {cat.nome}
                </Link>
              ))}
              {avionicosMoreCats.length > 0 && (
                <div className={styles.catDropdown}>
                  <span className={styles.catLink}>Outros <ChevronDown size={14} style={{marginLeft: '4px', verticalAlign: 'middle'}}/></span>
                  <div className={styles.catDropdownMenu}>
                    {avionicosMoreCats.map((cat) => (
                      <Link key={cat.slug} href={`/avionicos?categoria=${cat.slug}`}>{cat.nome}</Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.catSeparator} />

              <div className={styles.catDropdown}>
                <span className={`${styles.catLink} ${styles.catLinkAeronave}`}>
                  <PlaneTakeoff size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Ir para Aeronaves <ChevronDown size={14} style={{marginLeft: '4px', verticalAlign: 'middle'}}/>
                </span>
                <div className={styles.catDropdownMenu}>
                  <Link href="/aeronaves">Todas as Aeronaves</Link>
                  {categoriasAeronave.map((cat) => (
                    <Link key={cat.slug} href={`/aeronaves?categoria=${cat.slug}`}>{cat.nome}</Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // ==================== NAV DE AERONAVES ====================
            <>
              {aeronavesMainCats.map((cat) => (
                <Link key={cat.slug} href={`/aeronaves?categoria=${cat.slug}`} className={styles.catLink}>
                  {cat.nome}
                </Link>
              ))}
              {aeronavesMoreCats.length > 0 && (
                <div className={styles.catDropdown}>
                  <span className={styles.catLink}>Outros <ChevronDown size={14} style={{marginLeft: '4px', verticalAlign: 'middle'}}/></span>
                  <div className={styles.catDropdownMenu}>
                    {aeronavesMoreCats.map((cat) => (
                      <Link key={cat.slug} href={`/aeronaves?categoria=${cat.slug}`}>{cat.nome}</Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.catSeparator} />

              <div className={styles.catDropdown}>
                <span className={`${styles.catLink} ${styles.catLinkAeronave}`}>
                  <Plane size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Voltar para Aviônicos <ChevronDown size={14} style={{marginLeft: '4px', verticalAlign: 'middle'}}/>
                </span>
                <div className={styles.catDropdownMenu}>
                  <Link href="/avionicos">Todos os Aviônicos</Link>
                  {categoriasProduto.map((cat) => (
                    <Link key={cat.slug} href={`/avionicos?categoria=${cat.slug}`}>{cat.nome}</Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
