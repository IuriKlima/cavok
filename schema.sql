-- =============================================
-- SCHEMA COMPLETO E DEFINITIVO PARA SUPABASE
-- Cole isto no SQL Editor para criar ou recriar
-- todas as tabelas corretamente com todas as colunas.
-- =============================================

create extension if not exists "uuid-ossp";

CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- 'PRODUTO' / 'AERONAVE'
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marcas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    descricao_curta TEXT,
    preco NUMERIC,
    sku TEXT,
    homologado BOOLEAN DEFAULT false,
    destaque BOOLEAN DEFAULT false,
    condicao TEXT,
    categoria_id UUID REFERENCES categorias(id),
    marca_id UUID REFERENCES marcas(id),
    status TEXT DEFAULT 'ATIVO',
    imagem_url TEXT,
    imagens JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aeronaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descricao TEXT,
    assentos TEXT,
    horas_celula TEXT,
    ano_fabricacao TEXT,
    especificacoes TEXT,
    preco NUMERIC,
    destaque BOOLEAN DEFAULT false,
    categoria_id UUID REFERENCES categorias(id),
    imagem_url TEXT,
    imagens JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'DISPONIVEL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slides (
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

CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT NOT NULL,
    lido BOOLEAN DEFAULT false,
    tipo TEXT DEFAULT 'CONTATO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Políticas de Segurança RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeronaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid 'already exists' errors
DROP POLICY IF EXISTS "Anon SELECT" ON configuracoes;
DROP POLICY IF EXISTS "Anon SELECT" ON categorias;
DROP POLICY IF EXISTS "Anon SELECT" ON marcas;
DROP POLICY IF EXISTS "Anon SELECT" ON produtos;
DROP POLICY IF EXISTS "Anon SELECT" ON aeronaves;
DROP POLICY IF EXISTS "Anon SELECT" ON slides;

DROP POLICY IF EXISTS "Anon INSERT contatos" ON contatos;

DROP POLICY IF EXISTS "Admin CRUD" ON configuracoes;
DROP POLICY IF EXISTS "Admin CRUD" ON categorias;
DROP POLICY IF EXISTS "Admin CRUD" ON marcas;
DROP POLICY IF EXISTS "Admin CRUD" ON produtos;
DROP POLICY IF EXISTS "Admin CRUD" ON aeronaves;
DROP POLICY IF EXISTS "Admin CRUD" ON slides;
DROP POLICY IF EXISTS "Admin CRUD" ON contatos;

-- Permite GET para Visitantes do Site
CREATE POLICY "Anon SELECT" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON categorias FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON marcas FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON produtos FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON aeronaves FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON slides FOR SELECT USING (true);

-- Permite Inserir Contatos para Visitantes
CREATE POLICY "Anon INSERT contatos" ON contatos FOR INSERT WITH CHECK (true);

-- Permite Administrador Painel CRUD Total se logado via Supabase Auth
CREATE POLICY "Admin CRUD" ON configuracoes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON marcas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON produtos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON aeronaves FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin CRUD" ON contatos FOR ALL USING (auth.role() = 'authenticated');

-- Cria a permissão para Storage das imagens importadas
insert into storage.buckets (id, name, public) values ('public-images', 'public-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Storage" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Storage" ON storage.objects;

create policy "Public Access Storage" on storage.objects for select using ( bucket_id = 'public-images' );
create policy "Auth Update Storage" on storage.objects for all using ( bucket_id = 'public-images' and auth.role() = 'authenticated' );
