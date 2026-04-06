import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAeronaves, deletarAeronave } from '../api';
import './Crud.css';

export default function Aeronaves() {
  const [aeronaves, setAeronaves] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getAeronaves().then(data => {
      if (data) { setAeronaves(data.content || []); setTotal(data.totalElements || 0); }
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza?')) return;
    try { await deletarAeronave(id); fetchData(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Aeronaves</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{total} aeronaves cadastradas</p>
        </div>
        <Link to="/aeronaves/nova" className="btn btn-primary">+ Nova Aeronave</Link>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Aeronave</th><th>Ano</th><th>Categoria</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Carregando...</td></tr>
              ) : aeronaves.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Nenhuma aeronave</td></tr>
              ) : aeronaves.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{a.nome}</td>
                  <td>{a.anoFabricacao || '-'}</td>
                  <td>{a.categoria?.nome || '-'}</td>
                  <td><span className={`badge ${a.status === 'DISPONIVEL' ? 'badge-success' : a.status === 'VENDIDA' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span></td>
                  <td><div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/aeronaves/${a.id}`} className="btn btn-ghost btn-sm">✏️</Link>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(a.id)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
