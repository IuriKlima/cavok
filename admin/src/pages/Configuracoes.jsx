import { useState, useEffect } from 'react';
import { getConfiguracoes, atualizarConfiguracoes } from '../api';

export default function Configuracoes() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const labels = {
    telefone: 'Telefone', email: 'Email', whatsapp: 'WhatsApp (número)',
    site_nome: 'Nome do Site', site_descricao: 'Descrição do Site',
    endereco: 'Endereço', instagram: 'Instagram', facebook: 'Facebook',
    hero_titulo: '🏠 Título do Hero (Home)', hero_subtitulo: '🏠 Subtítulo do Hero (Home)',
    sobre_titulo: '📄 Título da Página Sobre', sobre_texto: '📄 Texto da Página Sobre',
    contato_titulo: '📧 Título da Página Contato', contato_texto: '📧 Texto da Página Contato',
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await atualizarConfiguracoes(configs.map(c => ({ chave: c.chave, valor: c.valor, tipo: c.tipo || 'text' })));
      alert('Configurações salvas!');
    } catch (e) { alert('Erro: ' + e.message); }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>Carregando...</div>;

  const sections = [
    { title: '📱 Contato e Redes', keys: ['telefone', 'email', 'whatsapp', 'endereco', 'instagram', 'facebook'] },
    { title: '🌐 Site', keys: ['site_nome', 'site_descricao'] },
    { title: '🏠 Página Inicial', keys: ['hero_titulo', 'hero_subtitulo'] },
    { title: '📄 Páginas Internas', keys: ['sobre_titulo', 'sobre_texto', 'contato_titulo', 'contato_texto'] },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Configurações</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Textos e configurações do site (100% dinâmico)</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</button>
      </div>

      {sections.map(section => (
        <div key={section.title} className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{section.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {configs.filter(c => section.keys.includes(c.chave)).map(c => (
              <div className="form-group" key={c.id}>
                <label className="form-label">{labels[c.chave] || c.chave}</label>
                {c.tipo === 'textarea' ? (
                  <textarea className="form-input" value={c.valor} onChange={e => handleChange(c.id, e.target.value)} rows={4} />
                ) : (
                  <input className="form-input" value={c.valor} onChange={e => handleChange(c.id, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
