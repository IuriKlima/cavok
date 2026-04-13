import { useState, useEffect } from 'react';
import { getConfiguracoes, atualizarConfiguracoes, uploadFiles } from '../api';
import { Save, Upload, Image } from 'lucide-react';

export default function Configuracoes() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});

  const labels = {
    telefone: 'Telefone', email: 'Email', whatsapp: 'WhatsApp (número)',
    site_nome: 'Nome do Site', site_descricao: 'Descrição do Site',
    endereco: 'Endereço', instagram: 'Instagram', facebook: 'Facebook',
    hero_titulo: 'Título do Hero (Home)', hero_subtitulo: 'Subtítulo do Hero (Home)',
    sobre_titulo: 'Título da Página Sobre', sobre_texto: 'Texto da Página Sobre',
    contato_titulo: 'Título da Página Contato', contato_texto: 'Texto da Página Contato',
    logo_avionicos: 'Logo Aviônicos', logo_aeronaves: 'Logo Aeronaves',
    aeronaves_hero_titulo: 'Título Hero Aeronaves', aeronaves_hero_subtitulo: 'Subtítulo Hero Aeronaves',
    aeronaves_hero_imagem: 'Imagem Hero Aeronaves',
  };

  useEffect(() => {
    getConfiguracoes().then(data => {
      if (data) setConfigs(data.map(c => ({ ...c, valor: c.valor || '' })));
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
      const payload = configs.map(c => ({ chave: c.chave, valor: c.valor || '', tipo: c.tipo || 'text' }));
      const updated = await atualizarConfiguracoes(payload);
      if (updated) setConfigs(updated.map(c => ({ ...c, valor: c.valor || '' })));
      alert('Configurações salvas!');
    } catch (e) { alert('Erro: ' + e.message); }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>Carregando...</div>;

  const imageKeys = ['logo_avionicos', 'logo_aeronaves', 'aeronaves_hero_imagem'];

  const sections = [
    { title: '📱 Contato e Redes', keys: ['telefone', 'email', 'whatsapp', 'endereco', 'instagram', 'facebook'] },
    { title: '🌐 Site', keys: ['site_nome', 'site_descricao'] },
    { title: '🎨 Logos', keys: ['logo_avionicos', 'logo_aeronaves'] },
    { title: '🏠 Página Inicial (Aviônicos)', keys: ['hero_titulo', 'hero_subtitulo'] },
    { title: '✈️ Página de Aeronaves', keys: ['aeronaves_hero_titulo', 'aeronaves_hero_subtitulo', 'aeronaves_hero_imagem'] },
    { title: '📄 Páginas Internas', keys: ['sobre_titulo', 'sobre_texto', 'contato_titulo', 'contato_texto'] },
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
              <img src={c.valor} alt={c.chave} style={{ maxHeight: 80, maxWidth: 200, objectFit: 'contain', display: 'block' }} />
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Configurações</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Textos, logos e configurações do site (100% dinâmico)</p>
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

      {/* Configs not in any section */}
      {(() => {
        const allKeys = sections.flatMap(s => s.keys);
        const otherConfigs = configs.filter(c => !allKeys.includes(c.chave));
        if (otherConfigs.length === 0) return null;
        return (
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>⚙️ Outras Configurações</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {otherConfigs.map(c => renderField(c))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
