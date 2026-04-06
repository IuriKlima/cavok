import { useState } from 'react';
import { importarXml } from '../api';
import './ImportXml.css';

export default function ImportXml() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await importarXml(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Erro ao importar. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Importar XML WordPress</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 24 }}>
        Importe produtos e aeronaves do arquivo XML exportado do WordPress
      </p>

      <div className="card" style={{ padding: 32 }}>
        <div className="import-zone">
          <input type="file" accept=".xml" id="xml-file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
          <label htmlFor="xml-file" className="import-label">
            <span className="import-icon">📥</span>
            <span className="import-text">{file ? file.name : 'Clique para selecionar o arquivo XML'}</span>
            <span className="import-hint">WordPress WXR Export (.xml)</span>
          </label>
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }} onClick={handleImport} disabled={!file || loading}>
          {loading ? 'Importando...' : 'Iniciar Importação'}
        </button>

        {error && <div style={{ marginTop: 16, padding: 16, background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>{error}</div>}

        {result && (
          <div className="import-result">
            <h3>✅ Importação concluída!</h3>
            <div className="result-stats">
              <div className="result-stat"><span className="result-value">{result.produtosImportados}</span><span>Produtos</span></div>
              <div className="result-stat"><span className="result-value">{result.aeronavesImportadas}</span><span>Aeronaves</span></div>
              <div className="result-stat"><span className="result-value">{result.imagensEncontradas}</span><span>Imagens</span></div>
            </div>
            {result.erros?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ color: 'var(--warning)', marginBottom: 8 }}>⚠️ {result.erros.length} erro(s):</h4>
                <ul style={{ paddingLeft: 20, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {result.erros.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
