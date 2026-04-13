import { useState, useEffect } from 'react';
import { getPaginas, criarPagina, atualizarPagina, deletarPagina } from '../api';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import './Crud.css';

export default function Paginas() {
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: '', slug: '', conteudo: '', metaTitle: '', metaDescription: '', imagemDestaque: '' });

  const fetchPaginas = () => {
    setLoading(true);
    getPaginas().then(data => { if (data) setPaginas(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPaginas(); }, []);

  const resetForm = () => {
    setForm({ titulo: '', slug: '', conteudo: '', metaTitle: '', metaDescription: '', imagemDestaque: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (pagina) => {
    setEditing(pagina.id);
    setForm({
      titulo: pagina.titulo || '', slug: pagina.slug || '', conteudo: pagina.conteudo || '',
      metaTitle: pagina.metaTitle || '', metaDescription: pagina.metaDescription || '',
      imagemDestaque: pagina.imagemDestaque || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await atualizarPagina(editing, form);
      } else {
        await criarPagina(form);
      }
      resetForm();
      fetchPaginas();
    } catch (err) { alert('Erro: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar esta página?')) return;
    try { await deletarPagina(id); fetchPaginas(); } catch (e) { alert(e.message); }
  };

  const makeSlug = (title) => title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Páginas</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{paginas.length} página(s)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Nova Página
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24, marginTop: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>{editing ? '✏️ Editar Página' : '➕ Nova Página'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" value={form.titulo} onChange={e => {
                const titulo = e.target.value;
                setForm(f => ({ ...f, titulo, slug: editing ? f.slug : makeSlug(titulo) }));
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Meta Title</label>
              <input className="form-input" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Meta Description</label>
              <input className="form-input" value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Conteúdo</label>
            <textarea className="form-input" value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} rows={8} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><X size={16} /> Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Save size={16} /> {editing ? 'Atualizar' : 'Criar Página'}</button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Título</th><th>Slug</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>Carregando...</td></tr>
              ) : paginas.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>Nenhuma página encontrada</td></tr>
              ) : paginas.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.titulo}</td>
                  <td>/{p.slug}</td>
                  <td>{p.criadoEm ? new Date(p.criadoEm).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}><Edit2 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
