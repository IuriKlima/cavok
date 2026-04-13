const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ynpzkzkypusjxwdfpaxv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxODc0MiwiZXhwIjoyMDkxNTk0NzQyfQ.uyUi6ladIbFvqjKQ_doJyOYBIIvLEd-eu1hImxJE190';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const keys = [
    'telefone', 'email', 'whatsapp', 'site_nome', 'site_descricao',
    'endereco', 'instagram', 'facebook', 'hero_titulo', 'hero_subtitulo',
    'sobre_titulo', 'sobre_texto', 'contato_titulo', 'contato_texto',
    'logo_avionicos', 'logo_aeronaves', 'aeronaves_hero_titulo',
    'aeronaves_hero_subtitulo', 'aeronaves_hero_imagem'
  ];

  const payload = keys.map(k => ({ chave: k, valor: '', tipo: k.includes('texto') || k.includes('descricao') ? 'textarea' : (k.includes('logo') || k.includes('imagem') ? 'image' : 'text') }));

  const { error } = await supabase.from('configuracoes').upsert(payload, { onConflict: 'chave' });
  if (error) console.error(error);
  else console.log("Configuracoes populadas no Supabase com sucesso!");
}
run();
