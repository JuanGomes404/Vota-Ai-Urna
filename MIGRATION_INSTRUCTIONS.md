# Instruções de Migração - Sistema de Votação

## Alterações Implementadas

### 1. Painel do Mesário
- ✅ Menu de seleção de eleições ativas
- ✅ Lista alfabética de todos os eleitores aptos a votar
- ✅ Funcionalidade de busca por matrícula (digitação)
- ✅ Funcionalidade de seleção direta do eleitor na lista (clique)
- ✅ Filtro de busca na lista de eleitores

### 2. Lógica de Votação e Credenciais
- ✅ Credenciais com validade de 5 minutos
- ✅ Exibição do tempo de expiração da credencial
- ✅ Validação automática de credenciais expiradas
- ✅ Status "já votou" só é marcado após confirmação do voto
- ✅ Credenciais expiradas são invalidadas automaticamente
- ✅ Eleitor pode gerar nova credencial se a anterior expirar

## Alterações no Banco de Dados

### Schema Prisma Atualizado
O modelo `Credencial` foi atualizado para incluir:
- `expiresAt`: DateTime - Data/hora de expiração da credencial (5 minutos após criação)
- `createdAt`: DateTime - Data/hora de criação da credencial
- Removido: constraint `@@unique([eleitorId, eleicaoId])` para permitir múltiplas credenciais

## Passos para Aplicar as Mudanças

### 1. Parar os containers Docker
```bash
docker-compose down
```

### 2. Navegar para o diretório do banco de dados
```bash
cd backend/database
```

### 3. Gerar o Prisma Client atualizado
```bash
npm install
npx prisma generate
```

### 4. Criar e aplicar a migração
```bash
npx prisma migrate dev --name add_credential_expiration
```

### 5. Voltar para o diretório raiz
```bash
cd ../..
```

### 6. Reconstruir e iniciar os containers
```bash
docker-compose build
docker-compose up -d
```

### 7. Verificar os logs
```bash
docker-compose logs -f backend
```

## Endpoints da API Atualizados

### Mesário
- `GET /mesario/eleicoes` - Listar eleições ativas
- `GET /mesario/eleitores/:eleicaoId` - **NOVO** - Listar todos os eleitores aptos (ordenados alfabeticamente)
- `GET /mesario/eleitor/:matricula?eleicaoId=xxx` - Buscar eleitor por matrícula
- `POST /mesario/habilitar` - Habilitar eleitor (retorna credencial com expiração)

### Resposta da Habilitação
```json
{
  "message": "Eleitor habilitado com sucesso",
  "credencial": "abc123xyz789",
  "expiresAt": "2025-10-22T15:30:00.000Z"
}
```

## Funcionalidades Implementadas

### Frontend - Painel do Mesário

1. **Seleção de Eleição**
   - Lista de eleições ativas
   - Seleção por clique

2. **Lista de Eleitores**
   - Ordenação alfabética automática
   - Campo de busca/filtro
   - Indicadores visuais de status (Apto/Já Votou)
   - Clique para selecionar eleitor

3. **Busca por Matrícula**
   - Campo de entrada manual
   - Validação de formato

4. **Exibição da Credencial**
   - Modal com informações destacadas
   - Aviso de validade de 5 minutos
   - Hora exata de expiração
   - Design melhorado com ícones e cores

### Backend - Lógica de Credenciais

1. **Geração de Credenciais**
   - Tempo de expiração: 5 minutos
   - Permite múltiplas credenciais por eleitor (se expirarem)

2. **Validação de Credenciais**
   - Verifica se está expirada
   - Invalida automaticamente se expirada
   - Mensagens de erro específicas

3. **Marcação de Voto**
   - Status "já votou" só é marcado após confirmação do voto na urna
   - Credencial é invalidada após uso
   - Se credencial expirar sem uso, eleitor pode gerar nova

## Testes Recomendados

1. **Teste de Expiração de Credencial**
   - Gerar credencial para eleitor
   - Aguardar 5 minutos
   - Tentar usar credencial expirada
   - Verificar mensagem de erro
   - Gerar nova credencial
   - Usar nova credencial antes de expirar

2. **Teste de Lista de Eleitores**
   - Selecionar eleição
   - Verificar lista ordenada alfabeticamente
   - Usar filtro de busca
   - Clicar em eleitor da lista
   - Verificar preenchimento automático

3. **Teste de Votação Completa**
   - Gerar credencial
   - Votar dentro de 5 minutos
   - Verificar status "já votou"
   - Tentar gerar nova credencial (deve falhar)

4. **Teste de Credencial Expirada**
   - Gerar credencial
   - NÃO votar
   - Aguardar 5 minutos
   - Verificar que status NÃO mudou para "já votou"
   - Gerar nova credencial (deve funcionar)

## Observações Importantes

- As credenciais expiradas são automaticamente invalidadas ao tentar usá-las
- Um eleitor pode ter múltiplas credenciais expiradas, mas apenas uma válida por vez
- O status "já votou" é irreversível e só é marcado após confirmação do voto
- A lista de eleitores é atualizada automaticamente após cada operação

