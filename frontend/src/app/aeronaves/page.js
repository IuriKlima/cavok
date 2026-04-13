'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSiteData } from '@/context/SiteContext';
import { getAeronaves } from '@/lib/api';
import { Plane, PlaneTakeoff, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function AeronavesPage() {
  const { categoriasAeronave = [], config = {} } = useSiteData();
  const allCats = [{ id: null, nome: 'Todos', slug: '' }, ...categoriasAeronave];
  const [activeCategory, setActiveCategory] = useState('');
  const [aeronaves, setAeronaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const catObj = allCats.find(c => c.slug === activeCategory);
    getAeronaves({ categoriaId: catObj?.id }).then(data => {
      if (data) setAeronaves(data.content || []);
      setLoading(false);
    });
  }, [activeCategory, categoriasAeronave]);

  return (
    <div className={styles.page}>
      <section className={styles.hero} style={config.aeronaves_hero_imagem ? { backgroundImage: `url(${config.aeronaves_hero_imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className={styles.heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className={styles.heroBadge} style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}><PlaneTakeoff size={16}/> Aeronaves à Venda</span>
          <h1 className={styles.heroTitle}>{config.aeronaves_hero_titulo || 'Encontre sua próxima aeronave'}</h1>
          <p className={styles.heroDesc}>{config.aeronaves_hero_subtitulo || 'Aeronaves selecionadas com procedência garantida'}</p>
        </div>
      </section>
      <div className="container">
        <div className={styles.filters}>
          {allCats.map((cat) => (
            <button key={cat.slug} className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.slug)}>{cat.nome}</button>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando...</div>
        ) : aeronaves.length > 0 ? (
          <div className={`grid grid-2 ${styles.grid}`}>
            {aeronaves.map((a) => (
              <Link key={a.id} href={`/aeronaves/${a.slug}`} className={`card ${styles.aircraftCard}`}>
                <div className={styles.cardImage}>
                  {a.imagemPrincipal ? <img src={a.imagemPrincipal} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className={styles.cardPlaceholder}><Plane size={48} color="rgba(255,255,255,0.2)"/></div>}
                  <span className={styles.statusBadge} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    {a.status === 'DISPONIVEL' ? <><CheckCircle size={14}/> Disponível</> : a.status}
                  </span>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardCategory}>{a.categoria?.nome || 'Aeronave'}</span>
                  <h3 className={styles.cardName}>{a.nome}</h3>
                  <div className={styles.cardSpecs}>
                    {a.anoFabricacao && <div className={styles.spec}><span className={styles.specLabel}>Ano</span><span className={styles.specValue}>{a.anoFabricacao}</span></div>}
                    {a.assentos && <div className={styles.spec}><span className={styles.specLabel}>Assentos</span><span className={styles.specValue}>{a.assentos}</span></div>}
                    {a.horasCelula && <div className={styles.spec}><span className={styles.specLabel}>Horas</span><span className={styles.specValue}>{a.horasCelula}</span></div>}
                  </div>
                  <span className={styles.cardCta}>Ver detalhes →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Nenhuma aeronave encontrada.</div>
        )}
      </div>
    </div>
  );
}
