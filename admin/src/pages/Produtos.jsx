import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos, deletarProduto } from '../api';
import './Crud.css';

export default function Produtos() {
  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = () => {
    setLoading(true);
    getProdutos(page, 20, search).then(data => {
      if (data) {
        setProdutos(data.content || []);
        setTotal(data.totalElements || 0);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProdutos(); }, [page]);

  const handleSearch = () => { setPage(0); fetchProdutos(); };
  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try { await deletarProduto(id); fetchProdutos(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Produtos</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{total} produtos cadastrados</p>
        </div>
        <Link to="/produtos/novo" className="btn btn-primary">+ Novo Produto</Link>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-toolbar">
          <input className="form-input" placeholder="Buscar produtos..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ maxWidth: 320 }} />
          <button className="btn btn-ghost btn-sm" onClick={handleSearch}>Buscar</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Produto</th><th>SKU</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Carregando...</td></tr>
              ) : produtos.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Nenhum produto encontrado</td></tr>
              ) : produtos.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.nome}</td>
                  <td>{p.sku || '-'}</td>
                  <td>{p.categoria?.nome || '-'}</td>
                  <td>{p.preco ? `R$ ${Number(p.preco).toLocaleString('pt-BR')}` : <span className="badge badge-warning">Consulte</span>}</td>
                  <td><span className={`badge ${p.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/produtos/${p.id}`} className="btn btn-ghost btn-sm">✏️</Link>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: 16, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p-1)}>← Anterior</button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Pág {page+1} de {Math.ceil(total/20)}</span>
            <button className="btn btn-ghost btn-sm" disabled={(page+1)*20 >= total} onClick={() => setPage(p => p+1)}>Próxima →</button>
          </div>
        )}
      </div>
    </div>
  );
}
