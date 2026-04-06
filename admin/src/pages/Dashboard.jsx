import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState({ totalProdutos: '...', totalAeronaves: '...', totalCategorias: '...', contatosNaoLidos: '...' });

  useEffect(() => {
    getDashboard().then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  const stats = [
    { label: 'Produtos', value: String(data.totalProdutos), icon: '🛒', color: 'primary', link: '/produtos' },
    { label: 'Aeronaves', value: String(data.totalAeronaves), icon: '✈️', color: 'accent', link: '/aeronaves' },
    { label: 'Categorias', value: String(data.totalCategorias), icon: '📁', color: 'success', link: '/categorias' },
    { label: 'Contatos', value: String(data.contatosNaoLidos), icon: '💬', color: 'warning', link: '/contatos' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema</p>
      </div>

      <div className="grid grid-4 stats-grid">
        {stats.map((stat, i) => (
          <Link to={stat.link} key={i} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Ações Rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/produtos" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>🛒 Gerenciar Produtos</Link>
            <Link to="/aeronaves" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>✈️ Gerenciar Aeronaves</Link>
            <Link to="/importar" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>📥 Importar XML WordPress</Link>
            <Link to="/configuracoes" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>⚙️ Configurações do Site</Link>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Informações do Sistema</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td style={{ color: 'var(--text-dim)' }}>Backend</td><td>Python FastAPI</td></tr>
              <tr><td style={{ color: 'var(--text-dim)' }}>Frontend</td><td>Next.js 16</td></tr>
              <tr><td style={{ color: 'var(--text-dim)' }}>Admin</td><td>React + Vite</td></tr>
              <tr><td style={{ color: 'var(--text-dim)' }}>Banco de dados</td><td>SQLite</td></tr>
              <tr><td style={{ color: 'var(--text-dim)' }}>Status</td><td><span className="badge badge-success">Online</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
