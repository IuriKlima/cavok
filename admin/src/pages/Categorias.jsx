import './Crud.css';

const categorias = [
  { id: 1, nome: 'PFD', slug: 'pfd', tipo: 'PRODUTO', ordem: 1 },
  { id: 2, nome: 'Piloto Automático', slug: 'piloto-automatico', tipo: 'PRODUTO', ordem: 2 },
  { id: 3, nome: 'Monitoramento de Motor', slug: 'monitoramento-de-motor', tipo: 'PRODUTO', ordem: 3 },
  { id: 4, nome: 'GPS/Nav/Com', slug: 'gps-nav-com', tipo: 'PRODUTO', ordem: 4 },
  { id: 5, nome: 'Monomotor Pistão', slug: 'monomotor-pistao', tipo: 'AERONAVE', ordem: 1 },
  { id: 6, nome: 'Bimotor Turboélice', slug: 'bimotor-turboelice', tipo: 'AERONAVE', ordem: 2 },
];

export default function Categorias() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Categorias</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{categorias.length} categorias</p>
        </div>
        <button className="btn btn-primary">+ Nova Categoria</button>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Slug</th><th>Tipo</th><th>Ordem</th><th>Ações</th></tr></thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nome}</td>
                  <td>{c.slug}</td>
                  <td><span className={`badge ${c.tipo === 'PRODUTO' ? 'badge-primary' : 'badge-warning'}`}>{c.tipo}</span></td>
                  <td>{c.ordem}</td>
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
