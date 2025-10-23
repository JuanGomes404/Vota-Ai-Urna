# Guia de Migração do Banco de Dados

Este guia detalha como aplicar as mudanças no schema do banco de dados para suportar as novas funcionalidades.

## Mudanças no Schema

### 1. Modelo Chapa
- **Adicionado**: campo `numero` (Int)
- **Adicionado**: constraint único `@@unique([numero, eleicaoId])`

### 2. Modelo Voto
- **Modificado**: `chapaId` agora é opcional (`String?`)
- **Modificado**: `chapa` agora é opcional (`Chapa?`)
- **Adicionado**: campo `tipo` (String, default: "valido")

## Comandos de Migração

### Desenvolvimento (Recriar banco - ⚠️ PERDE DADOS)

```bash
cd backend/database

# Resetar banco e aplicar schema
npx prisma migrate reset --force

# Gerar Prisma Client
npx prisma generate

# Popular com dados de teste (se houver seed)
npx prisma db seed
```

### Produção (Migração Segura - ⚠️ REQUER AJUSTES MANUAIS)

```bash
cd backend/database

# Criar migração
npx prisma migrate dev --name add_numero_and_tipo_voto --create-only

# Editar arquivo de migração gerado (ver seção abaixo)

# Aplicar migração
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

## Arquivo de Migração Manual

Se você tem dados existentes no banco, será necessário criar uma migração manual. 

O Prisma vai gerar um arquivo SQL em `backend/database/prisma/migrations/[timestamp]_add_numero_and_tipo_voto/migration.sql`.

**Edite este arquivo** para incluir:

```sql
-- Adicionar coluna numero à tabela Chapa
ALTER TABLE "Chapa" ADD COLUMN "numero" INTEGER;

-- Atribuir números temporários às chapas existentes
-- IMPORTANTE: Ajuste esta query para seus dados reais
UPDATE "Chapa" SET "numero" = 
  CASE 
    WHEN "nome" LIKE '%10%' THEN 10
    WHEN "nome" LIKE '%20%' THEN 20
    WHEN "nome" LIKE '%30%' THEN 30
    ELSE CAST(substr("id", 1, 2) AS INTEGER) * 10
  END;

-- Tornar coluna numero NOT NULL após atribuir valores
ALTER TABLE "Chapa" ALTER COLUMN "numero" SET NOT NULL;

-- Criar constraint único
CREATE UNIQUE INDEX "Chapa_numero_eleicaoId_key" ON "Chapa"("numero", "eleicaoId");

-- Modificar tabela Voto
ALTER TABLE "Voto" ALTER COLUMN "chapaId" DROP NOT NULL;
ALTER TABLE "Voto" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'valido';

-- Atualizar votos existentes
-- Todos os votos existentes serão marcados como 'valido'
-- Se necessário, ajuste manualmente votos brancos/nulos
```

## Opção Alternativa: Limpar e Recriar

Se você está em desenvolvimento ou pode perder os dados:

```bash
cd backend/database

# Apagar banco e recriar do zero
npx prisma migrate reset --force

# Ou manualmente:
# 1. Apagar arquivo prisma/migrations/
# 2. Apagar banco de dados
# 3. Executar:
npx prisma migrate dev --name initial

# Gerar client
npx prisma generate
```

## Verificação Pós-Migração

Após aplicar a migração, verifique:

### 1. Estrutura das Tabelas

```sql
-- Verificar tabela Chapa
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Chapa';

-- Deve mostrar coluna 'numero' como INTEGER NOT NULL

-- Verificar tabela Voto
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Voto';

-- Deve mostrar 'chapaId' como nullable e 'tipo' como TEXT NOT NULL
```

### 2. Constraints

```sql
-- Verificar constraint único em Chapa
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE table_name = 'Chapa' AND constraint_type = 'UNIQUE';

-- Deve mostrar 'Chapa_numero_eleicaoId_key'
```

### 3. Dados Existentes

```sql
-- Verificar se todas as chapas têm números
SELECT id, nome, numero, "eleicaoId" 
FROM "Chapa" 
WHERE numero IS NULL;

-- Não deve retornar resultados

-- Verificar tipos de voto
SELECT tipo, COUNT(*) 
FROM "Voto" 
GROUP BY tipo;

-- Deve mostrar contagem por tipo (valido, branco, nulo)
```

## Rollback (Em Caso de Problemas)

Se precisar reverter a migração:

```bash
cd backend/database

# Ver histórico de migrações
npx prisma migrate status

# Reverter última migração (⚠️ pode causar perda de dados)
npx prisma migrate resolve --rolled-back [migration-name]

# Restaurar backup do banco (recomendado)
# Use seus procedimentos de backup padrão
```

## Backup Antes da Migração

**SEMPRE faça backup antes de migrar em produção!**

```bash
# PostgreSQL
pg_dump -U postgres -d nome_do_banco > backup_pre_migration.sql

# Restaurar (se necessário)
psql -U postgres -d nome_do_banco < backup_pre_migration.sql
```

## Problemas Comuns

### Erro: "Unique constraint violated"
**Causa**: Chapas duplicadas com mesmo número na mesma eleição
**Solução**: Ajuste os números das chapas antes da migração

### Erro: "Column 'numero' cannot be null"
**Causa**: Tentativa de criar chapa sem número
**Solução**: Preencha todos os números antes de aplicar NOT NULL

### Erro: "Foreign key constraint failed"
**Causa**: Voto referenciando chapa inexistente
**Solução**: Limpe votos órfãos antes da migração

```sql
-- Limpar votos órfãos
DELETE FROM "Voto" 
WHERE "chapaId" NOT IN (SELECT id FROM "Chapa");
```

## Validação Final

Execute estes comandos para validar:

```bash
cd backend

# Compilar TypeScript
npm run build

# Verificar se compila sem erros
# Deve gerar arquivos em dist/

# Testar conexão
npm run start:dev

# Verificar logs - não deve ter erros do Prisma
```

## Contato

Se encontrar problemas durante a migração, verifique:
1. Logs do Prisma
2. Logs do PostgreSQL
3. Versão do Node.js (recomendado: >= 18)
4. Versão do Prisma (verificar package.json)

---

**Última atualização**: 22/10/2025

