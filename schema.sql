create extension if not exists "uuid-ossp";

CREATE TABLE configuracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- 'PRODUTO' / 'AERONAVE'
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE marcas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    descricao_curta TEXT,
    preco NUMERIC,
    sku TEXT,
    homologado BOOLEAN DEFAULT false,
    condicao TEXT,
    categoria_id UUID REFERENCES categorias(id),
    marca_id UUID REFERENCES marcas(id),
    status TEXT DEFAULT 'ATIVO',
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE aeronaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    assentos TEXT,
    horas_celula TEXT,
    ano_fabricacao TEXT,
    especificacoes TEXT,
    categoria_id UUID REFERENCES categorias(id),
    imagem_url TEXT,
    status TEXT DEFAULT 'DISPONIVEL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT,
    subtitulo TEXT,
    imagem_url TEXT,
    link TEXT,
    texto_botao TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Políticas de Segurança RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeronaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Permite GET para Visitantes do Site
CREATE POLICY "Anon SELECT" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON categorias FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON marcas FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON produtos FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON aeronaves FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON slides FOR SELECT USING (true);

-- Permite Administrador Painel CRUD Total se logado via Supabase Auth
CREATE POLICY "Admin CRUD" ON configuracoes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON marcas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON produtos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON aeronaves FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON slides FOR ALL USING (auth.role() = 'authenticated');

-- Cria a permissão para Storage das imagens importadas
insert into storage.buckets (id, name, public) values ('public-images', 'public-images', true) ON CONFLICT (id) DO NOTHING;

create policy "Public Access Storage" on storage.objects for select using ( bucket_id = 'public-images' );
create policy "Auth Update Storage" on storage.objects for all using ( bucket_id = 'public-images' and auth.role() = 'authenticated' );
