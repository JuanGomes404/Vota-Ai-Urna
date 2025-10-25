-- Script de inicialização do banco de dados Vota Ai
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar usuário administrador padrão (senha: admin123)
INSERT INTO "Administrador" (id, nome, email, senha, "createdAt") 
VALUES (
    gen_random_uuid(),
    'Administrador Vota Ai',
    'admin@vota-ai.com',
    'admin123',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Criar usuário mesário padrão (senha: mesario123)
INSERT INTO "Mesario" (id, nome, usuario, senha, "createdAt")
VALUES (
    gen_random_uuid(),
    'Mesário Vota Ai',
    'mesario01',
    'mesario123',
    NOW()
) ON CONFLICT (usuario) DO NOTHING;

