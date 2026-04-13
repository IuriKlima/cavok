-- =============================================
-- Migração: Adicionar coluna tipo em contatos
-- Cole no SQL Editor do Supabase E EXECUTE
-- =============================================

ALTER TABLE contatos ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'CONTATO';
