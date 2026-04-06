import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduto, criarProduto, atualizarProduto, getCategorias, uploadFiles } from '../api';
import './ProdutoForm.css';

export default function ProdutoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    nome: '', slug: '', sku: '', descricao: '', descricaoCurta: '',
    preco: '', categoriaId: '', marcaId: '', condicao: 'Novo',
    status: 'ATIVO', destaque: false, homologado: false,
    imagemPrincipal: '', imagens: [],
  });

  useEffect(() => {
    getCategorias('PRODUTO').then(data => { if (data) setCategorias(data); }).catch(() => {});
    if (isEdit) {
      getProduto(id).then(data => {
        if (data) setForm({
          nome: data.nome || '', slug: data.slug || '', sku: data.sku || '',
          descricao: data.descricao || '', descricaoCurta: data.descricaoCurta || '',
          preco: data.preco || '', categoriaId: data.categoria?.id || '',
          marcaId: data.marca?.id || '', condicao: data.condicao || 'Novo',
          status: data.status || 'ATIVO', destaque: data.destaque || false,
          homologado: data.homologado || false, imagemPrincipal: data.imagemPrincipal || '',
          imagens: data.imagens || [],
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const result = await uploadFiles(files);
      if (result?.urls) {
        if (!form.imagemPrincipal && result.urls.length > 0) {
          setForm(prev => ({ ...prev, imagemPrincipal: result.urls[0], imagens: [...prev.imagens, ...result.urls.slice(1)] }));
        } else {
          setForm(prev => ({ ...prev, imagens: [...prev.imagens, ...result.urls] }));
        }
      }
    } catch (err) { alert('Erro no upload: ' + err.message); }
    setUploading(false);
  };

  const removeImage = (url) => {
    if (form.imagemPrincipal === url) {
      const next = form.imagens[0] || '';
      setForm(prev => ({ ...prev, imagemPrincipal: next, imagens: prev.imagens.filter(i => i !== next) }));
    } else {
      setForm(prev => ({ ...prev, imagens: prev.imagens.filter(i => i !== url) }));
    }
  };

  const setAsPrincipal = (url) => {
    setForm(prev => ({
      ...prev,
      imagemPrincipal: url,
      imagens: [prev.imagemPrincipal, ...prev.imagens.filter(i => i !== url)].filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, preco: form.preco ? Number(form.preco) : null, categoriaId: form.categoriaId ? Number(form.categoriaId) : null };
      if (isEdit) await atualizarProduto(id, payload);
      else await criarProduto(payload);
      navigate('/produtos');
    } catch (err) { alert('Erro: ' + err.message); }
    setLoading(false);
  };

  const allImages = [form.imagemPrincipal, ...(form.imagens || [])].filter(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/produtos')}>← Voltar</button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Imagens */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="form-section-title">📷 Imagens (convertidas automaticamente para WebP)</h3>
          <div className="image-grid">
            {allImages.map((url, i) => (
              <div key={url} className={`image-item ${i === 0 ? 'image-principal' : ''}`}>
                <img src={url} alt="" />
                <div className="image-actions">
                  {i !== 0 && <button type="button" className="img-btn" onClick={() => setAsPrincipal(url)} title="Definir como principal">⭐</button>}
                  <button type="button" className="img-btn img-btn-danger" onClick={() => removeImage(url)} title="Remover">✕</button>
                </div>
                {i === 0 && <span className="image-badge">Principal</span>}
              </div>
            ))}
            <label className="image-upload-btn">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              {uploading ? '⏳ Enviando...' : '+ Adicionar'}
            </label>
          </div>
        </div>

        {/* Info básica */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="form-section-title">Informações Básicas</h3>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group"><label className="form-label">Nome *</label><input className="form-input" name="nome" value={form.nome} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Slug</label><input className="form-input" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-gerado" /></div>
            <div className="form-group"><label className="form-label">SKU</label><input className="form-input" name="sku" value={form.sku} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Preço (R$)</label><input className="form-input" name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Descrição Curta</label>
            <textarea className="form-input" name="descricaoCurta" value={form.descricaoCurta} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Descrição Completa</label>
            <textarea className="form-input" name="descricao" value={form.descricao} onChange={handleChange} rows={6} />
          </div>
        </div>

        {/* Classificação */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="form-section-title">Classificação</h3>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="form-input" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                <option value="">Selecione...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Condição</label>
              <select className="form-input" name="condicao" value={form.condicao} onChange={handleChange}>
                <option>Novo</option><option>Usado</option><option>Recondicionado</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" name="status" value={form.status} onChange={handleChange}>
                <option value="ATIVO">Ativo</option><option value="INATIVO">Inativo</option><option value="RASCUNHO">Rascunho</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} /> Em destaque
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <input type="checkbox" name="homologado" checked={form.homologado} onChange={handleChange} /> Homologado
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/produtos')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : isEdit ? 'Atualizar Produto' : 'Salvar Produto'}</button>
        </div>
      </form>
    </div>
  );
}
