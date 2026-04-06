'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useSiteData } from '@/context/SiteContext';
import { getProdutos, buscarProdutos } from '@/lib/api';
import styles from './page.module.css';

function AvionicosContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('q') || '';
  const { categoriasProduto = [] } = useSiteData();

  const allCats = [{ id: null, nome: 'Todos', slug: '' }, ...categoriasProduto];
  const [activeCategory, setActiveCategory] = useState(categoriaParam);
  const [produtos, setProdutos] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    const catObj = allCats.find(c => c.slug === activeCategory);
    const categoriaId = catObj?.id || undefined;

    const fetchData = searchQuery
      ? buscarProdutos(searchQuery, page)
      : getProdutos({ page, size: 12, categoriaId });

    fetchData.then(data => {
      if (data) {
        setProdutos(data.content || []);
        setTotalProdutos(data.totalElements || 0);
      }
      setLoading(false);
    });
  }, [activeCategory, page, searchQuery, categoriasProduto]);

  useEffect(() => {
    setActiveCategory(categoriaParam);
    setPage(0);
  }, [categoriaParam]);

  const totalPages = Math.ceil(totalProdutos / 12);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className="breadcrumbs"><a href="/">Início</a><span>/</span><strong>Aviônicos</strong></div>
      </div>
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categorias</h3>
          <nav className={styles.catList}>
            {allCats.map((cat) => (
              <button key={cat.slug} className={`${styles.catBtn} ${activeCategory === cat.slug ? styles.catBtnActive : ''}`}
                onClick={() => { setActiveCategory(cat.slug); setPage(0); }}>
                {cat.nome}
              </button>
            ))}
          </nav>
        </aside>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>
              {searchQuery ? `Resultados para "${searchQuery}"` :
               activeCategory ? allCats.find(c => c.slug === activeCategory)?.nome || 'Aviônicos' : 'Todos os Aviônicos'}
            </h1>
            <span className={styles.count}>{totalProdutos} produto(s)</span>
          </div>
          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : produtos.length > 0 ? (
            <>
              <div className={`grid grid-3 ${styles.productsGrid}`}>
                {produtos.map((produto) => (<ProductCard key={produto.id} produto={produto} />))}
              </div>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button>
                  <span className={styles.pageInfo}>Página {page + 1} de {totalPages}</span>
                  <button className="btn btn-ghost" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Próxima →</button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.empty}><p>Nenhum produto encontrado.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AvionicosPage() {
  return (
    <Suspense fallback={<div style={{padding: '100px', textAlign: 'center'}}>Carregando...</div>}>
      <AvionicosContent />
    </Suspense>
  );
}
