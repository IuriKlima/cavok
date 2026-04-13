const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ynpzkzkypusjxwdfpaxv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190'
);

async function check() {
  const { data: cats, error } = await supabase.from('categorias').select('*');
  console.log('=== CATEGORIAS NO BANCO ===');
  console.log('Total:', cats?.length);
  if (cats) cats.forEach(c => console.log(`  [${c.tipo}] ${c.nome} (slug: ${c.slug})`));
  if (error) console.log('ERRO:', error);

  const { data: configs } = await supabase.from('configuracoes').select('chave, valor');
  console.log('\n=== CONFIGURAÇÕES ===');
  if (configs) configs.forEach(c => console.log(`  ${c.chave}: ${c.valor || '(vazio)'}`));
}
check();
