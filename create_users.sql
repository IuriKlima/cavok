-- =============================================
-- PASSO 1: Limpar usuários criados com erro
-- =============================================
DELETE FROM auth.identities WHERE provider_id IN ('admin@cavokavionics.com.br', 'aeronaves@cavokavionics.com.br');
DELETE FROM auth.users WHERE email IN ('admin@cavokavionics.com.br', 'aeronaves@cavokavionics.com.br');
