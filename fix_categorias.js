const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ynpzkzkypusjxwdfpaxv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190'
);

async function fix() {
  // As categorias de aeronave do WordPress estavam como wp:category (não wp:term)
  // Inserir manualmente as categorias de aeronave que existiam no site original
  const aeroCats = [
    { slug: 'monomotores', nome: 'Monomotores', tipo: 'AERONAVE', ordem: 1 },
    { slug: 'bimotores', nome: 'Bimotores', tipo: 'AERONAVE', ordem: 2 },
    { slug: 'bimotor-turboelice', nome: 'Bimotor Turboélice', tipo: 'AERONAVE', ordem: 3 },
    { slug: 'monomotor-turboelice', nome: 'Monomotor Turboélice', tipo: 'AERONAVE', ordem: 4 },
  ];

  const { data, error } = await supabase.from('categorias').upsert(aeroCats, { onConflict: 'slug' }).select();
  if (error) console.error('ERRO:', error);
  else console.log('Categorias de aeronave inseridas:', data.length);

  // Associar aeronaves à categoria MONOMOTORES (padrão) caso não tenham categoria
  const monoCat = data.find(c => c.slug === 'monomotores');
  if (monoCat) {
    const { data: updated } = await supabase.from('aeronaves')
      .update({ categoria_id: monoCat.id })
      .is('categoria_id', null)
      .select('nome');
    console.log('Aeronaves atualizadas para Monomotores:', updated?.length || 0);
  }

  console.log('FEITO!');
}
fix();
