import { useState, useEffect } from 'react';
import { getContatos, marcarContatoLido, deletarContato } from '../api';
import { useAuth } from '../context/AuthContext';
import { Trash2, CheckCircle, Mail, Plane, FileText } from 'lucide-react';
import './Crud.css';

export default function Contatos() {
  const { user } = useAuth();
  const isAero = user?.role === 'AERONAVES';
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(isAero ? 'AERONAVE' : 'TODOS');

  const fetchContatos = async () => {
    setLoading(true);
    try {
      const data = await getContatos();
      setContatos(data);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContatos();
  }, []);

  const handleMarkAsRead = async (id) => {
    await marcarContatoLido(id);
    fetchContatos();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Tem certeza que deseja apagar esta mensagem?')) {
      await deletarContato(id);
      fetchContatos();
    }
  };

  const filtered = contatos.filter(c => activeTab === 'TODOS' ? true : c.tipo === activeTab);

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'ORCAMENTO': return <span className="badge badge-accent">💰 Orçamento</span>;
      case 'AERONAVE': return <span className="badge badge-primary">✈️ Aeronave</span>;
      default: return <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>✉️ Geral</span>;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Mensagens & Contatos</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{filtered.length} mensagens {activeTab !== 'TODOS' ? 'nesta aba' : 'no total'}</p>
        </div>
      </div>

      {!isAero && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button className={`btn ${activeTab === 'TODOS' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('TODOS')}>Todos</button>
          <button className={`btn ${activeTab === 'CONTATO' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('CONTATO')}>Contatos Gerais</button>
          <button className={`btn ${activeTab === 'ORCAMENTO' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('ORCAMENTO')}>Orçamentos</button>
          <button className={`btn ${activeTab === 'AERONAVE' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('AERONAVE')}>Aeronaves</button>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Carregando dados...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Nenhuma mensagem encontrada.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Mensagem</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th style={{ width: 100 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ background: c.lido ? 'transparent' : 'var(--primary-50)' }}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nome}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{c.email}</div>
                      {c.telefone && <div style={{ color: 'var(--text-dim)' }}>{c.telefone}</div>}
                    </td>
                    <td style={{ maxWidth: 280, fontSize: '0.85rem' }}>
                      {c.mensagem}
                    </td>
                    <td>{getTipoBadge(c.tipo)}</td>
                    <td>
                      {c.lido ? (
                        <span className="badge badge-success" style={{ background: '#dcfce7', color: '#16a34a' }}>Lido</span>
                      ) : (
                        <span className="badge badge-warning" style={{ background: '#fef9c3', color: '#ca8a04' }}>Novo</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!c.lido && (
                          <button className="btn btn-ghost btn-sm" title="Marcar como lido" onClick={() => handleMarkAsRead(c.id)}>
                            <CheckCircle size={18} color="var(--success)" />
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" title="Apagar" onClick={() => handleDelete(c.id)}>
                          <Trash2 size={18} color="var(--error)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
