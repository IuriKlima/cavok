-- =============================================
-- Migração: Adicionar colunas faltantes
-- Cole no SQL Editor do Supabase
-- =============================================

-- Produtos: adicionar coluna de destaque e imagens adicionais
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS imagens JSONB DEFAULT '[]'::jsonb;

-- Aeronaves: adicionar colunas de destaque, imagens e preço
ALTER TABLE aeronaves ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;
ALTER TABLE aeronaves ADD COLUMN IF NOT EXISTS imagens JSONB DEFAULT '[]'::jsonb;
ALTER TABLE aeronaves ADD COLUMN IF NOT EXISTS preco NUMERIC;
