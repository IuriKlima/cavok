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

-- =============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeronaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- LIMPAR TODAS AS POLÍTICAS ANTERIORES
-- =============================================
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
-- Novas políticas granulares
DROP POLICY IF EXISTS "Admin Global CRUD" ON configuracoes;
DROP POLICY IF EXISTS "Admin Global CRUD" ON categorias;
DROP POLICY IF EXISTS "Admin Global CRUD" ON marcas;
DROP POLICY IF EXISTS "Admin Global CRUD" ON produtos;
DROP POLICY IF EXISTS "Admin Global CRUD" ON aeronaves;
DROP POLICY IF EXISTS "Admin Global CRUD" ON slides;
DROP POLICY IF EXISTS "Admin Global CRUD" ON contatos;
DROP POLICY IF EXISTS "Admin Aeronaves CRUD aeronaves" ON aeronaves;
DROP POLICY IF EXISTS "Admin Aeronaves SELECT categorias" ON categorias;
DROP POLICY IF EXISTS "Admin Aeronaves CRUD contatos" ON contatos;
DROP POLICY IF EXISTS "Admin Aeronaves SELECT configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "Admin Aeronaves UPDATE configuracoes" ON configuracoes;

-- =============================================
-- FUNÇÃO AUXILIAR: Verifica se é admin de aeronaves
-- =============================================
CREATE OR REPLACE FUNCTION is_aeronaves_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt()->>'email') LIKE 'aeronaves@%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- POLÍTICAS DE LEITURA PÚBLICA (Visitantes do Site)
-- =============================================
CREATE POLICY "Anon SELECT" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON categorias FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON marcas FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON produtos FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON aeronaves FOR SELECT USING (true);
CREATE POLICY "Anon SELECT" ON slides FOR SELECT USING (true);

-- Visitantes podem INSERIR contatos (formulários públicos)
CREATE POLICY "Anon INSERT contatos" ON contatos FOR INSERT WITH CHECK (true);

-- =============================================
-- POLÍTICAS ADMIN GLOBAL (email NÃO começa com 'aeronaves@')
-- Acesso CRUD total em TODAS as tabelas
-- =============================================
CREATE POLICY "Admin Global CRUD" ON configuracoes FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON categorias FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON marcas FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON produtos FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON aeronaves FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON slides FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

CREATE POLICY "Admin Global CRUD" ON contatos FOR ALL
  USING (auth.role() = 'authenticated' AND NOT is_aeronaves_admin());

-- =============================================
-- POLÍTICAS ADMIN AERONAVES (email começa com 'aeronaves@')
-- Acesso RESTRITO: Apenas aeronaves, contatos de aeronaves,
-- categorias de aeronaves (somente leitura) e configurações específicas
-- =============================================

-- Aeronaves: CRUD completo
CREATE POLICY "Admin Aeronaves CRUD aeronaves" ON aeronaves FOR ALL
  USING (auth.role() = 'authenticated' AND is_aeronaves_admin());

-- Categorias: Somente SELECT (não pode criar/editar/deletar categorias)
CREATE POLICY "Admin Aeronaves SELECT categorias" ON categorias FOR SELECT
  USING (auth.role() = 'authenticated' AND is_aeronaves_admin());

-- Contatos: VER/EDITAR/DELETAR somente os de tipo 'AERONAVE'
CREATE POLICY "Admin Aeronaves CRUD contatos" ON contatos FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND is_aeronaves_admin()
    AND tipo = 'AERONAVE'
  );

-- Configurações: Pode LER todas (para carregar a tela) mas NÃO pode alterar globais
CREATE POLICY "Admin Aeronaves SELECT configuracoes" ON configuracoes FOR SELECT
  USING (auth.role() = 'authenticated' AND is_aeronaves_admin());

-- Configurações: Pode ATUALIZAR somente chaves de aeronaves
CREATE POLICY "Admin Aeronaves UPDATE configuracoes" ON configuracoes FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND is_aeronaves_admin()
    AND chave LIKE 'aeronaves_%'
  );

-- =============================================
-- STORAGE (imagens)
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('public-images', 'public-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Storage" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Storage" ON storage.objects;

CREATE POLICY "Public Access Storage" ON storage.objects FOR SELECT USING ( bucket_id = 'public-images' );
CREATE POLICY "Auth Update Storage" ON storage.objects FOR ALL USING ( bucket_id = 'public-images' AND auth.role() = 'authenticated' );
