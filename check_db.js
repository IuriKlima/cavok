const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ynpzkzkypusjxwdfpaxv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190'
);

async function check() {
  // Verificar URLs de imagens dos produtos
  const { data: prods } = await supabase.from('produtos').select('nome, imagem_url').limit(5);
  console.log('=== PRODUTOS (5 primeiros) ===');
  prods?.forEach(p => console.log(`  ${p.nome}: ${p.imagem_url || 'SEM IMAGEM'}`));

  // Verificar aeronaves
  const { data: aeros } = await supabase.from('aeronaves').select('nome, imagem_url').limit(5);
  console.log('\n=== AERONAVES (5 primeiras) ===');
  aeros?.forEach(a => console.log(`  ${a.nome}: ${a.imagem_url || 'SEM IMAGEM'}`));

  // Verificar storage
  const { data: files, error } = await supabase.storage.from('public-images').list('', { limit: 5 });
  console.log('\n=== STORAGE (5 primeiros arquivos) ===');
  if (error) console.log('ERRO:', error);
  else if (files?.length === 0) console.log('BUCKET VAZIO!');
  else files?.forEach(f => console.log(`  ${f.name} (${f.metadata?.size || '?'} bytes)`));

  // Verificar slides
  const { data: slides } = await supabase.from('slides').select('*');
  console.log('\n=== SLIDES ===');
  console.log('Total:', slides?.length || 0);
  slides?.forEach(s => console.log(`  ${s.titulo}: ${s.imagem_url || 'SEM IMAGEM'}`));
}
check();
