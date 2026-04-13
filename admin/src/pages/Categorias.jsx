import { useState, useEffect } from 'react';
import { getCategorias, criarCategoria, atualizarCategoria, deletarCategoria, generateSlug } from '../api';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import './Crud.css';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', slug: '', tipo: 'PRODUTO', ordem: 0 });

  const fetchCategorias = () => {
    setLoading(true);
    getCategorias().then(data => {
      if (data) setCategorias(data.sort((a, b) => a.ordem - b.ordem));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const resetForm = () => {
    setForm({ nome: '', slug: '', tipo: 'PRODUTO', ordem: categorias.length });
    setEditing(null);
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setForm({
      nome: cat.nome || '',
      slug: cat.slug || '',
      tipo: cat.tipo || 'PRODUTO',
      ordem: cat.ordem || 0
    });
  };

  const handleSave = async () => {
    if (!form.nome) return alert('Nome da categoria é obrigatório.');
    
    setLoading(true);
    try {
      const payload = {
        ...form,
        slug: form.slug ? generateSlug(form.slug) : generateSlug(form.nome),
        ordem: Number(form.ordem)
      };

      if (editing) {
        await atualizarCategoria(editing, payload);
      } else {
        await criarCategoria(payload);
      }
      resetForm();
      fetchCategorias();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar esta categoria?')) return;
    setLoading(true);
    try {
      await deletarCategoria(id);
      fetchCategorias();
    } catch (e) {
      alert('Erro, ela pode estar atrelada a produtos/aeronaves: ' + e.message);
      setLoading(false);
    }
  };

  if (loading && categorias.length === 0) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>Carregando...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Categorias</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{categorias.length} categorias</p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {editing ? '✏️ Editar Categoria' : '➕ Nova Categoria'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Monomotor Pistão" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug (Opcional)</label>
            <input className="form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="ex: monomotor-pistao" />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-input" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="PRODUTO">Produto (Aviônico)</option>
              <option value="AERONAVE">Aeronave</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ordem</label>
            <input type="number" className="form-input" value={form.ordem} onChange={e => setForm(f => ({ ...f, ordem: e.target.value }))} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          {editing && <button className="btn btn-ghost" onClick={resetForm} disabled={loading}><X size={16} /> Cancelar</button>}
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={16} /> {editing ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Tabela de Categorias */}
      <div className="card">
        <div className="table-wrap">
          {categorias.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Nenhuma categoria ainda.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Slug</th>
                  <th>Tipo</th>
                  <th>Ordem</th>
                  <th style={{ width: 100 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nome}</td>
                    <td>{c.slug}</td>
                    <td>
                      <span className={`badge ${c.tipo === 'PRODUTO' ? 'badge-primary' : 'badge-warning'}`}>
                        {c.tipo}
                      </span>
                    </td>
                    <td>{c.ordem}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(c)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id)} title="Deletar" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
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
