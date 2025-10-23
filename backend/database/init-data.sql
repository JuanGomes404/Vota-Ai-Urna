-- Script para criar dados iniciais após migração do Prisma
-- Este script deve ser executado após o Prisma criar as tabelas

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

