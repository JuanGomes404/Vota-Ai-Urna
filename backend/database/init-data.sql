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

-- Criar eleição de exemplo
INSERT INTO "Eleicao" (id, nome, descricao, ativa, status, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Eleição de Exemplo - Vota Ai',
    'Eleição de demonstração do sistema Vota Ai',
    false,
    'Criada',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Criar eleitores de exemplo (assumindo que existe uma eleição)
-- Nota: Em produção, os eleitores devem ser importados via API
INSERT INTO "Eleitor" (id, nome, matricula, curso, "eleicaoId", "jaVotou")
SELECT 
    gen_random_uuid(),
    'João Silva',
    '2021001234',
    'Ciência da Computação',
    e.id,
    false
FROM "Eleicao" e 
WHERE e.nome = 'Eleição de Exemplo - Vota Ai'
LIMIT 1
ON CONFLICT (matricula) DO NOTHING;

INSERT INTO "Eleitor" (id, nome, matricula, curso, "eleicaoId", "jaVotou")
SELECT 
    gen_random_uuid(),
    'Maria Santos',
    '2021005678',
    'Engenharia de Software',
    e.id,
    false
FROM "Eleicao" e 
WHERE e.nome = 'Eleição de Exemplo - Vota Ai'
LIMIT 1
ON CONFLICT (matricula) DO NOTHING;

INSERT INTO "Eleitor" (id, nome, matricula, curso, "eleicaoId", "jaVotou")
SELECT 
    gen_random_uuid(),
    'Pedro Oliveira',
    '2021009012',
    'Sistemas de Informação',
    e.id,
    false
FROM "Eleicao" e 
WHERE e.nome = 'Eleição de Exemplo - Vota Ai'
LIMIT 1
ON CONFLICT (matricula) DO NOTHING;
