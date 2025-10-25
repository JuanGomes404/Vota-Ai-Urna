-- ============================================
-- EXEMPLO: Como criar uma eleição completa
-- ============================================
-- Este arquivo serve como referência para criar eleições manualmente no banco de dados
-- RECOMENDAÇÃO: Use a interface web para criar eleições!
-- Use este SQL apenas para testes ou troubleshooting

-- ============================================
-- PASSO 1: Criar a Eleição
-- ============================================
-- Substitua os valores entre <colchetes> pelos dados reais
INSERT INTO "Eleicao" (id, nome, descricao, ativa, status, "createdAt", "updatedAt")
VALUES (
    '<UUID-DA-ELEICAO>', -- Gere um UUID único ou use gen_random_uuid()
    '<NOME DA ELEIÇÃO>',
    '<DESCRIÇÃO DA ELEIÇÃO>',
    false,  -- Inicia como inativa
    'Criada',  -- Status inicial
    NOW(),
    NOW()
);

-- Exemplo prático:
-- INSERT INTO "Eleicao" (id, nome, descricao, ativa, status, "createdAt", "updatedAt")
-- VALUES (
--     gen_random_uuid(),
--     'Eleição DCE 2025',
--     'Eleição para Diretório Central dos Estudantes',
--     false,
--     'Criada',
--     NOW(),
--     NOW()
-- );

-- ============================================
-- PASSO 2: Criar Chapas
-- ============================================
-- Cada chapa deve ter um número único dentro da eleição
INSERT INTO "Chapa" (id, nome, numero, "eleicaoId")
VALUES 
    (gen_random_uuid(), '<NOME DA CHAPA 1>', 10, '<UUID-DA-ELEICAO>'),
    (gen_random_uuid(), '<NOME DA CHAPA 2>', 20, '<UUID-DA-ELEICAO>'),
    (gen_random_uuid(), '<NOME DA CHAPA 3>', 30, '<UUID-DA-ELEICAO>');

-- Exemplo prático:
-- INSERT INTO "Chapa" (id, nome, numero, "eleicaoId")
-- VALUES 
--     (gen_random_uuid(), 'Chapa Inovação', 10, '<UUID-DA-ELEICAO>'),
--     (gen_random_uuid(), 'Chapa Renovação', 20, '<UUID-DA-ELEICAO>'),
--     (gen_random_uuid(), 'Chapa Unidade', 30, '<UUID-DA-ELEICAO>');

-- ============================================
-- PASSO 3: Cadastrar Eleitores
-- ============================================
-- IMPORTANTE: Use a interface web para importar eleitores via CSV!
-- A importação automática também gera as credenciais

INSERT INTO "Eleitor" (id, nome, matricula, curso, "eleicaoId", "jaVotou")
VALUES 
    (gen_random_uuid(), '<NOME DO ELEITOR>', '<MATRÍCULA>', '<CURSO>', '<UUID-DA-ELEICAO>', false);

-- Exemplo prático:
-- INSERT INTO "Eleitor" (id, nome, matricula, curso, "eleicaoId", "jaVotou")
-- VALUES 
--     (gen_random_uuid(), 'João Silva', '20230001', 'Engenharia de Software', '<UUID-DA-ELEICAO>', false),
--     (gen_random_uuid(), 'Maria Santos', '20230002', 'Ciência da Computação', '<UUID-DA-ELEICAO>', false);

-- ============================================
-- PASSO 4: Gerar Credenciais para Eleitores
-- ============================================
-- IMPORTANTE: As credenciais devem ser únicas e seguras
-- Na interface web, isso é feito automaticamente pelo mesário

-- Função auxiliar para gerar token (exemplo)
-- Na prática, o backend gera tokens seguros

INSERT INTO "Credencial" (id, "eleitorId", "eleicaoId", token, usada)
SELECT 
    gen_random_uuid(),
    e.id,
    e."eleicaoId",
    substring(md5(random()::text), 1, 8), -- Token simples para exemplo
    false
FROM "Eleitor" e
WHERE e."eleicaoId" = '<UUID-DA-ELEICAO>'
AND NOT EXISTS (
    SELECT 1 FROM "Credencial" c 
    WHERE c."eleitorId" = e.id AND c."eleicaoId" = e."eleicaoId"
);

-- ============================================
-- PASSO 5: Ativar a Eleição (quando pronto para votar)
-- ============================================
-- IMPORTANTE: Só ative quando chapas e eleitores estiverem cadastrados!

UPDATE "Eleicao" 
SET 
    ativa = true, 
    status = 'Ativa',
    "updatedAt" = NOW()
WHERE id = '<UUID-DA-ELEICAO>';

-- ============================================
-- PASSO 6: Encerrar a Eleição (após período de votação)
-- ============================================

UPDATE "Eleicao" 
SET 
    ativa = false, 
    status = 'Encerrada',
    "updatedAt" = NOW()
WHERE id = '<UUID-DA-ELEICAO>';

-- ============================================
-- CONSULTAS ÚTEIS
-- ============================================

-- Ver todas as eleições
SELECT id, nome, status, ativa FROM "Eleicao" ORDER BY "createdAt" DESC;

-- Ver chapas de uma eleição
SELECT c.numero, c.nome, e.nome as eleicao
FROM "Chapa" c
JOIN "Eleicao" e ON c."eleicaoId" = e.id
WHERE c."eleicaoId" = '<UUID-DA-ELEICAO>'
ORDER BY c.numero;

-- Ver eleitores de uma eleição
SELECT nome, matricula, curso, "jaVotou"
FROM "Eleitor"
WHERE "eleicaoId" = '<UUID-DA-ELEICAO>'
ORDER BY nome;

-- Ver credenciais não usadas
SELECT e.nome, e.matricula, c.token, c.usada
FROM "Credencial" c
JOIN "Eleitor" e ON c."eleitorId" = e.id
WHERE c."eleicaoId" = '<UUID-DA-ELEICAO>' AND c.usada = false;

-- Ver resultados (após encerramento)
SELECT 
    ch.numero,
    ch.nome as chapa,
    COUNT(v.id) as votos
FROM "Chapa" ch
LEFT JOIN "Voto" v ON v."chapaId" = ch.id
WHERE ch."eleicaoId" = '<UUID-DA-ELEICAO>'
GROUP BY ch.id, ch.numero, ch.nome
ORDER BY ch.numero;

-- Ver estatísticas completas
SELECT 
    COUNT(*) FILTER (WHERE tipo = 'valido') as votos_validos,
    COUNT(*) FILTER (WHERE tipo = 'branco') as votos_brancos,
    COUNT(*) FILTER (WHERE tipo = 'nulo') as votos_nulos,
    COUNT(*) as total_votos
FROM "Voto"
WHERE "eleicaoId" = '<UUID-DA-ELEICAO>';

-- ============================================
-- LIMPEZA (CUIDADO!)
-- ============================================
-- Use apenas em desenvolvimento/testes

-- Apagar uma eleição específica (CASCADE apaga chapas, eleitores, credenciais e votos)
-- DELETE FROM "Eleicao" WHERE id = '<UUID-DA-ELEICAO>';

-- Apagar TODAS as eleições (CUIDADO!)
-- DELETE FROM "Eleicao";

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Sempre use a interface web quando possível
-- 2. Faça backup antes de modificar dados em produção
-- 3. Tokens de credencial devem ser gerados de forma segura
-- 4. Números de chapa devem ser únicos por eleição
-- 5. Não altere eleições ativas ou encerradas sem necessidade
-- 6. Resultados só devem ser visualizados após encerramento

