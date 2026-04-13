import { useState, useEffect } from 'react';
import { getSlides, criarSlide, atualizarSlide, deletarSlide, uploadFiles } from '../api';
import { Plus, GripVertical, Trash2, Eye, EyeOff, Edit2, Save, X, Upload } from 'lucide-react';

export default function Slides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ titulo: '', subtitulo: '', imagemUrl: '', link: '', textoBotao: '', ordem: 0, ativo: true });
  const [uploading, setUploading] = useState(false);

  const fetchSlides = () => {
    setLoading(true);
    getSlides().then(data => { if (data) setSlides(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSlides(); }, []);

  const resetForm = () => {
    setForm({ titulo: '', subtitulo: '', imagemUrl: '', link: '', textoBotao: '', ordem: slides.length, ativo: true });
    setEditing(null);
  };

  const handleEdit = (slide) => {
    setEditing(slide.id);
    setForm({ titulo: slide.titulo || '', subtitulo: slide.subtitulo || '', imagemUrl: slide.imagemUrl || '', link: slide.link || '', textoBotao: slide.textoBotao || '', ordem: slide.ordem, ativo: slide.ativo });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const result = await uploadFiles(files);
      if (result?.urls?.[0]) setForm(prev => ({ ...prev, imagemUrl: result.urls[0] }));
    } catch (err) { alert('Erro no upload: ' + err.message); }
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await atualizarSlide(editing, form);
      } else {
        await criarSlide({ ...form, ordem: slides.length });
      }
      resetForm();
      fetchSlides();
    } catch (err) { alert('Erro: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar este slide?')) return;
    try { await deletarSlide(id); fetchSlides(); } catch (e) { alert(e.message); }
  };

  const toggleAtivo = async (slide) => {
    try {
      await atualizarSlide(slide.id, { ...slide, ativo: !slide.ativo });
      fetchSlides();
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>Carregando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Slides da Home</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{slides.length} slide(s) configurado(s)</p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {editing ? '✏️ Editar Slide' : '➕ Novo Slide'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input className="form-input" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título do slide" />
          </div>
          <div className="form-group">
            <label className="form-label">Subtítulo</label>
            <input className="form-input" value={form.subtitulo} onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))} placeholder="Subtítulo do slide" />
          </div>
          <div className="form-group">
            <label className="form-label">Link do Botão</label>
            <input className="form-input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/avionicos" />
          </div>
          <div className="form-group">
            <label className="form-label">Texto do Botão</label>
            <input className="form-input" value={form.textoBotao} onChange={e => setForm(f => ({ ...f, textoBotao: e.target.value }))} placeholder="Ver Produtos" />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label">Imagem de Fundo</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input className="form-input" value={form.imagemUrl} onChange={e => setForm(f => ({ ...f, imagemUrl: e.target.value }))} placeholder="URL da imagem" style={{ flex: 1 }} />
            <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <Upload size={16} /> {uploading ? 'Enviando...' : 'Upload'}
            </label>
          </div>
        </div>
        {form.imagemUrl && (
          <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', maxHeight: 200 }}>
            <img src={form.imagemUrl} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          {editing && <button className="btn btn-ghost" onClick={resetForm}><X size={16} /> Cancelar</button>}
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={16} /> {editing ? 'Atualizar' : 'Adicionar Slide'}
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {slides.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>
            Nenhum slide configurado. Adicione o primeiro acima.
          </div>
        ) : slides.map((slide, i) => (
          <div key={slide.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, opacity: slide.ativo ? 1 : 0.5 }}>
            <div style={{ color: 'var(--text-dim)', cursor: 'grab' }}><GripVertical size={20} /></div>
            <div style={{ width: 120, height: 68, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-tertiary)' }}>
              {slide.imagemUrl ? <img src={slide.imagemUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '0.75rem' }}>Sem imagem</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{slide.titulo || '(Sem título)'}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: 2 }}>{slide.subtitulo || ''}</div>
              {slide.link && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 4, display: 'inline-block' }}>{slide.link}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleAtivo(slide)} title={slide.ativo ? 'Desativar' : 'Ativar'}>
                {slide.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(slide)} title="Editar"><Edit2 size={16} /></button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(slide.id)} title="Deletar" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
