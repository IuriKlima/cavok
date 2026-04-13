import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAeronave, criarAeronave, atualizarAeronave, getCategorias, uploadFiles } from '../api';
import './ProdutoForm.css';

export default function AeronaveForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    nome: '', slug: '', descricao: '', assentos: '', horasCelula: '',
    anoFabricacao: '', especificacoes: '', preco: '', status: 'DISPONIVEL',
    destaque: false, categoriaId: '', imagemPrincipal: '', imagens: [],
  });

  useEffect(() => {
    getCategorias('AERONAVE').then(data => { if (data) setCategorias(data); }).catch(() => {});
    if (isEdit) {
      getAeronave(id).then(data => {
        if (data) setForm({
          nome: data.nome || '', slug: data.slug || '', descricao: data.descricao || '',
          assentos: data.assentos || '', horasCelula: data.horasCelula || data.horas_celula || '',
          anoFabricacao: data.anoFabricacao || data.ano_fabricacao || '', especificacoes: data.especificacoes || '',
          preco: data.preco || '', status: data.status || 'DISPONIVEL',
          destaque: data.destaque || false, categoriaId: data.categoriaId || data.categoria_id || '',
          imagemPrincipal: data.imagemPrincipal || data.imagem_url || '', imagens: data.imagens || [],
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
      ...prev, imagemPrincipal: url,
      imagens: [prev.imagemPrincipal, ...prev.imagens.filter(i => i !== url)].filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // api.js aeronaveToSnake() faz a conversão dos campos
      if (isEdit) await atualizarAeronave(id, form);
      else await criarAeronave(form);
      navigate('/aeronaves');
    } catch (err) { alert('Erro: ' + err.message); }
    setLoading(false);
  };

  const allImages = [form.imagemPrincipal, ...(form.imagens || [])].filter(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{isEdit ? 'Editar Aeronave' : 'Nova Aeronave'}</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/aeronaves')}>← Voltar</button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="card" style={{ padding: 24 }}>
          <h3 className="form-section-title">📷 Imagens (WebP automático)</h3>
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

        <div className="card" style={{ padding: 24 }}>
          <h3 className="form-section-title">Informações da Aeronave</h3>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="form-group"><label className="form-label">Nome *</label><input className="form-input" name="nome" value={form.nome} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Slug</label><input className="form-input" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-gerado" /></div>
            <div className="form-group"><label className="form-label">Ano Fabricação</label><input className="form-input" name="anoFabricacao" value={form.anoFabricacao} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Assentos</label><input className="form-input" name="assentos" value={form.assentos} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Horas de Célula</label><input className="form-input" name="horasCelula" value={form.horasCelula} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Preço (R$)</label><input className="form-input" name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Descrição</label>
            <textarea className="form-input" name="descricao" value={form.descricao} onChange={handleChange} rows={6} />
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Especificações Técnicas</label>
            <textarea className="form-input" name="especificacoes" value={form.especificacoes} onChange={handleChange} rows={4} />
          </div>
        </div>

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
              <label className="form-label">Status</label>
              <select className="form-input" name="status" value={form.status} onChange={handleChange}>
                <option value="DISPONIVEL">Disponível</option><option value="VENDIDA">Vendida</option><option value="RESERVADA">Reservada</option><option value="INATIVA">Inativa</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.88rem', paddingBottom: 10 }}>
                <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} /> Em destaque
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/aeronaves')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Salvar Aeronave'}</button>
        </div>
      </form>
    </div>
  );
}
