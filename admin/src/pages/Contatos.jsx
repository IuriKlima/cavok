import './Crud.css';

export default function Contatos() {
  const contatos = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', mensagem: 'Gostaria de orçamento para Garmin G5...', tipo: 'COTACAO', lido: false, criadoEm: '2026-03-27' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', mensagem: 'Informações sobre aeronave Cessna 172...', tipo: 'CONTATO', lido: true, criadoEm: '2026-03-26' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Contatos</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{contatos.length} mensagens</p>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Email</th><th>Mensagem</th><th>Tipo</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {contatos.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nome}</td>
                  <td>{c.email}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.mensagem}</td>
                  <td><span className={`badge ${c.tipo === 'COTACAO' ? 'badge-primary' : 'badge-warning'}`}>{c.tipo}</span></td>
                  <td><span className={`badge ${c.lido ? 'badge-success' : 'badge-danger'}`}>{c.lido ? 'Lido' : 'Novo'}</span></td>
                  <td>{c.criadoEm}</td>
                  <td><div style={{ display: 'flex', gap: 6 }}><button className="btn btn-ghost btn-sm">👁️</button><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
