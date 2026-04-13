import { useState, useEffect } from 'react';
import { getConfiguracoes, atualizarConfiguracoes, uploadFiles } from '../api';
import { Save, Upload } from 'lucide-react';

export default function ConfiguracoesAeronaves() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});

  const labels = {
    aeronaves_hero_titulo: 'Título Hero Aeronaves', aeronaves_hero_subtitulo: 'Subtítulo Hero Aeronaves',
    aeronaves_hero_imagem: 'Imagem Hero Aeronaves',
    aeronaves_telefone: 'Telefone (Aeronaves)', aeronaves_email: 'Email (Aeronaves)', aeronaves_whatsapp: 'WhatsApp Nº (Aeronaves)',
  };

  useEffect(() => {
    getConfiguracoes().then(data => {
      // Filtra apenas configurações que interessam para Aeronaves
      if (data) {
        const myKeys = Object.keys(labels);
        const filtered = data.filter(c => myKeys.includes(c.chave));
        setConfigs(filtered.map(c => ({ ...c, valor: c.valor || '' })));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (id, valor) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, valor } : c));
  };

  const handleImageUpload = async (configId, chave) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      setUploading(prev => ({ ...prev, [chave]: true }));
      try {
        const result = await uploadFiles(files);
        if (result?.urls?.[0]) {
          handleChange(configId, result.urls[0]);
        }
      } catch (err) { alert('Erro no upload: ' + err.message); }
      setUploading(prev => ({ ...prev, [chave]: false }));
    };
    input.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = configs.map(c => ({ id: c.id, chave: c.chave, valor: c.valor || '', tipo: c.tipo || 'text' }));
      const updated = await atualizarConfiguracoes(payload);
      if (updated) {
        const myKeys = Object.keys(labels);
        setConfigs(updated.filter(c => myKeys.includes(c.chave)).map(c => ({ ...c, valor: c.valor || '' })));
      }
      alert('Configurações de Aeronaves salvas!');
    } catch (e) { alert('Erro: ' + e.message); }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>Carregando...</div>;

  const imageKeys = ['aeronaves_hero_imagem'];

  const sections = [
    { title: '✈️ Contato Exclusivo (Aeronaves)', keys: ['aeronaves_telefone', 'aeronaves_email', 'aeronaves_whatsapp'] },
    { title: '✈️ Página de Aeronaves (Design)', keys: ['aeronaves_hero_titulo', 'aeronaves_hero_subtitulo', 'aeronaves_hero_imagem'] },
  ];

  const renderField = (c) => {
    const isImage = imageKeys.includes(c.chave) || c.tipo === 'image';

    if (isImage) {
      return (
        <div className="form-group" key={c.id}>
          <label className="form-label">{labels[c.chave] || c.chave}</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input className="form-input" value={c.valor} onChange={e => handleChange(c.id, e.target.value)} placeholder="URL da imagem" style={{ flex: 1 }} />
            <button type="button" className="btn btn-ghost" onClick={() => handleImageUpload(c.id, c.chave)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Upload size={16} /> {uploading[c.chave] ? 'Enviando...' : 'Upload'}
            </button>
          </div>
          {c.valor && (
            <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', display: 'inline-block', border: '1px solid var(--border)' }}>
              <img src={c.valor} alt={c.chave} style={{ maxHeight: 80, maxWidth: 200, objectFit: 'cover', display: 'block' }} />
            </div>
          )}
        </div>
      );
    }

    if (c.tipo === 'textarea') {
      return (
        <div className="form-group" key={c.id}>
          <label className="form-label">{labels[c.chave] || c.chave}</label>
          <textarea className="form-input" value={c.valor} onChange={e => handleChange(c.id, e.target.value)} rows={4} />
        </div>
      );
    }

    return (
      <div className="form-group" key={c.id}>
        <label className="form-label">{labels[c.chave] || c.chave}</label>
        <input className="form-input" value={c.valor} onChange={e => handleChange(c.id, e.target.value)} />
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Configurações de Aeronaves</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Textos, imagens e contatos focados no setor de Aeronaves</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {sections.map(section => {
        const sectionConfigs = configs.filter(c => section.keys.includes(c.chave));
        if (sectionConfigs.length === 0) return null;
        return (
          <div key={section.title} className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{section.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sectionConfigs.map(c => renderField(c))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
