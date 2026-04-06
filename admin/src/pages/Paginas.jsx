import './Crud.css';

const demoPaginas = [
  { id: 1, titulo: 'Sobre Nós', slug: 'sobre', criadoEm: '2026-03-27' },
  { id: 2, titulo: 'Contato', slug: 'contato', criadoEm: '2026-03-27' },
  { id: 3, titulo: 'Política de Privacidade', slug: 'privacidade', criadoEm: '2026-03-27' },
];

export default function Paginas() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Páginas</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{demoPaginas.length} páginas</p>
        </div>
        <button className="btn btn-primary">+ Nova Página</button>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Título</th><th>Slug</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {demoPaginas.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.titulo}</td>
                  <td>/{p.slug}</td>
                  <td>{p.criadoEm}</td>
                  <td><div style={{ display: 'flex', gap: 6 }}><button className="btn btn-ghost btn-sm">✏️</button><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
