-- =============================================
-- Tabela de Contatos (Formulário Público do Site)
-- Cole no SQL Editor do Supabase
-- =============================================

CREATE TABLE IF NOT EXISTS contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT NOT NULL,
    lido BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Visitantes podem enviar mensagens de contato (INSERT only)
CREATE POLICY "Anon INSERT contatos" ON contatos FOR INSERT WITH CHECK (true);

-- Admin autenticado pode ver, marcar como lido, deletar
CREATE POLICY "Admin CRUD contatos" ON contatos FOR ALL USING (auth.role() = 'authenticated');
