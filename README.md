# 🗳️ Vota Ai - Sistema de Votação Eletrônica

Sistema completo de votação eletrônica desenvolvido para TCC, implementando todos os requisitos funcionais e regras de negócio necessárias para um processo eleitoral seguro e transparente.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Requisitos Funcionais](#-requisitos-funcionais)
- [Regras de Negócio](#-regras-de-negócio)
- [Casos de Uso](#-casos-de-uso)
- [API Endpoints](#-api-endpoints)
- [Sistema de Permissionamento](#-sistema-de-permissionamento)
- [Banco de Dados](#-banco-de-dados)
- [Docker](#-docker)
- [Testes](#-testes)
- [Tecnologias](#-tecnologias)

---

## 🎯 Visão Geral

O **Vota Ai** é um sistema de votação eletrônica completo que permite a realização de eleições de forma segura, transparente e eficiente. O sistema implementa dois níveis de acesso (Administrador e Mesário) com funcionalidades específicas para cada papel.

### Características Principais
- ✅ **Sistema Monolítico** unificado para facilitar desenvolvimento e manutenção
- ✅ **Permissionamento Robusto** com JWT e roles
- ✅ **Votação Anônima** garantindo privacidade do eleitor
- ✅ **Credenciais de Uso Único** para máxima segurança
- ✅ **Interface RESTful** para integração com frontend
- ✅ **Containerização Docker** para fácil deploy

---

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Nginx         │    │   PostgreSQL    │
│   (React/Vue)   │◄──►│   (Proxy)       │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Backend       │
                       │   (NestJS)      │
                       │   - Auth        │
                       │   - Admin       │
                       │   - Mesário     │
                       │   - Urna        │
                       └─────────────────┘
```

### Componentes
- **Backend**: API REST em NestJS com TypeScript
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT com roles (admin/mesário)
- **Proxy**: Nginx para balanceamento e SSL
- **Containerização**: Docker e Docker Compose

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Docker Desktop instalado e rodando
- Docker Compose v2.0+
- Portas 3000, 5432, 80 disponíveis

### Execução Rápida

```bash
# 1. Clone o repositório
git clone <repository-url>
cd Vota-Ai-Urna

# 2. Subir todos os serviços
docker-compose up --build

# 3. Aguardar inicialização (2-3 minutos)
# O sistema criará automaticamente:
# - Banco de dados PostgreSQL
# - Tabelas do Prisma
# - Usuários padrão
# - Dados iniciais
```

### Execução em Background

```bash
# Subir em background
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f backend
```

### Parar o Sistema

```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpar dados)
docker-compose down -v
```

### Verificação de Funcionamento

```bash
# Health Check
curl http://localhost:3000/health

# Login Admin
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vota-ai.com","senha":"admin123"}'

# Login Mesário
curl -X POST http://localhost:3000/mesario/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"mesario01","senha":"mesario123"}'
```

---

## ⚙️ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **JWT Tokens** com expiração de 8 horas
- **Roles**: Admin e Mesário com permissões específicas
- **Guards de Segurança** protegendo endpoints
- **Validação de Credenciais** em tempo real

### 👨‍💼 Administrador
- ✅ Criar e gerenciar eleições
- ✅ Criar chapas candidatas
- ✅ Importar lista de eleitores
- ✅ Ativar/encerrar eleições
- ✅ Visualizar resultados
- ✅ Gerenciar usuários do sistema

### 👨‍⚖️ Mesário
- ✅ Buscar eleitores por matrícula
- ✅ Habilitar eleitores para votação
- ✅ Gerar credenciais de uso único
- ✅ Verificar status da urna
- ✅ Validar identidade dos eleitores

### 🗳️ Urna Eletrônica
- ✅ Validar credenciais de votação
- ✅ Listar chapas disponíveis
- ✅ Registrar votos anonimamente
- ✅ Invalidar credenciais após uso
- ✅ Verificar status da eleição

---

## 📝 Requisitos Funcionais

### RF01 - Autenticação de Administrador
**Descrição**: O sistema deve permitir que administradores façam login na plataforma.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/login`
- Validação de email e senha
- Geração de token JWT com role 'admin'

### RF02 - Criação de Eleições
**Descrição**: Administradores devem poder criar novas eleições.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/eleicoes`
- Campos: nome, descrição
- Status inicial: "Criada" (inativa)

### RF03 - Criação de Chapas
**Descrição**: Administradores devem poder criar chapas para as eleições.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/chapas`
- Associação com eleição específica
- Campos: nome, descrição, eleicaoId

### RF04 - Importação de Eleitores
**Descrição**: Administradores devem poder importar lista de eleitores.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/eleitores/importar`
- Validação de dados obrigatórios
- Associação com eleição específica

### RF05 - Ativação de Eleições
**Descrição**: Administradores devem poder ativar eleições para votação.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/eleicoes/:id/ativar`
- Mudança de status para "Ativa"
- Validação de pré-requisitos

### RF06 - Encerramento de Eleições
**Descrição**: Administradores devem poder encerrar eleições.
**Status**: ✅ **Implementado**
- Endpoint: `POST /admin/eleicoes/:id/encerrar`
- Mudança de status para "Encerrada"
- Bloqueio de novos votos

### RF07 - Visualização de Resultados
**Descrição**: Administradores devem poder visualizar resultados das eleições.
**Status**: ✅ **Implementado**
- Endpoint: `GET /admin/eleicoes/:id/resultado`
- Contagem de votos por chapa
- Validação de status da eleição

### RF08 - Autenticação de Mesário
**Descrição**: Mesários devem poder fazer login na plataforma.
**Status**: ✅ **Implementado**
- Endpoint: `POST /mesario/login`
- Validação de usuário e senha
- Geração de token JWT com role 'mesario'

### RF09 - Busca de Eleitores
**Descrição**: Mesários devem poder buscar eleitores por matrícula.
**Status**: ✅ **Implementado**
- Endpoint: `GET /mesario/eleitor/:matricula`
- Validação de eleitor na lista oficial
- Retorno de status de votação

### RF10 - Habilitação de Eleitores
**Descrição**: Mesários devem poder habilitar eleitores para votação.
**Status**: ✅ **Implementado**
- Endpoint: `POST /mesario/habilitar`
- Geração de credencial única
- Validação de pré-requisitos

### RF11 - Validação de Credenciais
**Descrição**: O sistema deve validar credenciais de votação.
**Status**: ✅ **Implementado**
- Endpoint: `POST /urna/validar-credencial`
- Verificação de validade e uso
- Retorno de status da credencial

### RF12 - Listagem de Chapas
**Descrição**: O sistema deve listar chapas disponíveis para votação.
**Status**: ✅ **Implementado**
- Endpoint: `GET /urna/chapas`
- Filtro por eleição ativa
- Retorno de dados das chapas

### RF13 - Confirmação de Voto
**Descrição**: O sistema deve permitir confirmação de votos.
**Status**: ✅ **Implementado**
- Endpoint: `POST /urna/confirmar`
- Registro anônimo do voto
- Invalidação da credencial

### RF14 - Validação de Identidade
**Descrição**: O sistema deve validar identidade dos eleitores.
**Status**: ✅ **Implementado**
- Endpoint: `POST /identidade/validar`
- Validação simplificada para TCC
- Retorno de status de validação

### RF15 - Monitoramento do Sistema
**Descrição**: O sistema deve fornecer endpoints de monitoramento.
**Status**: ✅ **Implementado**
- Endpoint: `GET /health`
- Status da aplicação
- Timestamp e informações do serviço

---

## 📋 Regras de Negócio

### RN01 - Gestão Exclusiva do Administrador
**Descrição**: Apenas administradores podem criar, ativar e encerrar eleições.
**Implementação**: ✅ Guards de autorização com role 'admin'

### RN02 - Eleições Inativas por Padrão
**Descrição**: Eleições são criadas no status "Criada" e inativas.
**Implementação**: ✅ Campo `ativa: false` e `status: "Criada"` por padrão

### RN03 - Ativação de Eleições
**Descrição**: Eleições só podem ser ativadas por administradores.
**Implementação**: ✅ Endpoint protegido com validação de role

### RN04 - Encerramento de Eleições
**Descrição**: Eleições só podem ser encerradas por administradores.
**Implementação**: ✅ Endpoint protegido com validação de role

### RN05 - Lista Oficial de Eleitores
**Descrição**: Apenas eleitores da lista oficial podem ser habilitados.
**Implementação**: ✅ Validação de existência na tabela Eleitor

### RN06 - Verificação de Votação
**Descrição**: Sistema deve verificar se eleitor já votou.
**Implementação**: ✅ Campo `jaVotou` na tabela Eleitor

### RN07 - Status Irreversível
**Descrição**: Status de "já votou" é irreversível.
**Implementação**: ✅ Campo `jaVotou` não pode ser alterado após true

### RN08 - Habilitação Única
**Descrição**: Eleitor só pode ser habilitado uma vez por eleição.
**Implementação**: ✅ Validação de credencial existente

### RN09 - Credenciais de Uso Único
**Descrição**: Credenciais são geradas com token único e invalidadas após uso.
**Implementação**: ✅ Token único e campo `usada` na tabela Credencial

### RN10 - Votação Anônima
**Descrição**: Votos não devem conter dados que identifiquem o eleitor.
**Implementação**: ✅ Tabela Voto sem campos de identificação

### RN11 - Validação de Eleição Ativa
**Descrição**: Votos só podem ser registrados em eleições ativas.
**Implementação**: ✅ Validação de `ativa: true` antes do voto

### RN12 - Dois Níveis de Acesso
**Descrição**: Sistema deve ter dois níveis: Administrador e Mesário.
**Implementação**: ✅ Roles 'admin' e 'mesario' com permissões específicas

### RN13 - Privacidade dos Votos
**Descrição**: Não deve ser possível associar voto ao eleitor.
**Implementação**: ✅ Tabela Voto sem referência ao Eleitor

---

## 🎭 Casos de Uso

### UC01 - Administrador Criar Eleição
**Ator**: Administrador
**Pré-condições**: Usuário autenticado como admin
**Fluxo Principal**:
1. Administrador faz login
2. Acessa criação de eleição
3. Preenche dados da eleição
4. Sistema cria eleição inativa
5. Sistema retorna confirmação

### UC02 - Mesário Habilitar Eleitor
**Ator**: Mesário
**Pré-condições**: Usuário autenticado como mesário
**Fluxo Principal**:
1. Mesário faz login
2. Busca eleitor por matrícula
3. Verifica se eleitor pode votar
4. Gera credencial única
5. Sistema marca eleitor como votou
6. Sistema retorna credencial

### UC03 - Eleitor Votar
**Ator**: Eleitor
**Pré-condições**: Credencial válida gerada
**Fluxo Principal**:
1. Eleitor acessa urna
2. Insere credencial
3. Sistema valida credencial
4. Sistema lista chapas disponíveis
5. Eleitor seleciona chapa
6. Sistema registra voto anônimo
7. Sistema invalida credencial
8. Sistema confirma voto

### UC04 - Administrador Ver Resultados
**Ator**: Administrador
**Pré-condições**: Eleição encerrada
**Fluxo Principal**:
1. Administrador faz login
2. Acessa resultados da eleição
3. Sistema valida status da eleição
4. Sistema conta votos por chapa
5. Sistema retorna resultados

---

## 🌐 API Endpoints

### Autenticação
```http
POST /admin/login
POST /mesario/login
```

### Administrador (Requer Token Admin)
```http
POST /admin/eleicoes              # Criar eleição
POST /admin/chapas                # Criar chapa
POST /admin/eleitores/importar    # Importar eleitores
POST /admin/eleicoes/:id/ativar   # Ativar eleição
POST /admin/eleicoes/:id/encerrar # Encerrar eleição
GET  /admin/eleicoes/:id/resultado # Ver resultados
```

### Mesário (Requer Token Mesário)
```http
GET  /mesario/eleitor/:matricula  # Buscar eleitor
POST /mesario/habilitar           # Habilitar eleitor
GET  /urna/status                 # Status da urna
```

### Urna (Público)
```http
POST /urna/validar-credencial     # Validar credencial
GET  /urna/chapas                # Listar chapas
POST /urna/confirmar             # Confirmar voto
```

### Sistema
```http
GET  /health                     # Health check
POST /identidade/validar         # Validar identidade
```

---

## 📡 Exemplos de Requisições

### 🔐 Autenticação

#### Login do Administrador
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vota-ai.com",
    "senha": "admin123"
  }'
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "58465236-5e52-4425-9bd2-28c4fd91806f",
    "nome": "Administrador Vota Ai",
    "email": "admin@vota-ai.com",
    "role": "admin"
  }
}
```

#### Login do Mesário
```bash
curl -X POST http://localhost:3000/mesario/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "mesario01",
    "senha": "mesario123"
  }'
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1b5da682-fd8b-4aaa-bb32-7fd78cb49451",
    "nome": "Mesário Vota Ai",
    "usuario": "mesario01",
    "role": "mesario"
  }
}
```

### 👨‍💼 Administrador

#### Criar Eleição
```bash
curl -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Eleição para Representante Estudantil 2025",
    "descricao": "Eleição para escolha do representante estudantil do curso de Ciência da Computação"
  }'
```

**Resposta:**
```json
{
  "message": "Eleição criada com sucesso",
  "eleicao": {
    "id": "eleicao-uuid-aqui",
    "nome": "Eleição para Representante Estudantil 2025",
    "descricao": "Eleição para escolha do representante estudantil...",
    "ativa": false,
    "status": "Criada",
    "createdAt": "2025-10-17T06:00:00.000Z"
  }
}
```

#### Criar Chapa
```bash
curl -X POST http://localhost:3000/admin/chapas \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Chapa Renovação",
    "descricao": "Chapa comprometida com a renovação da representação estudantil",
    "eleicaoId": "eleicao-uuid-aqui"
  }'
```

#### Importar Eleitores
```bash
curl -X POST http://localhost:3000/admin/eleitores/importar \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "nome": "João Silva",
      "matricula": "2021001234",
      "curso": "Ciência da Computação"
    },
    {
      "nome": "Maria Santos",
      "matricula": "2021005678",
      "curso": "Engenharia de Software"
    },
    {
      "nome": "Pedro Oliveira",
      "matricula": "2021009012",
      "curso": "Sistemas de Informação"
    },
    {
      "nome": "Ana Costa",
      "matricula": "2021003456",
      "curso": "Ciência da Computação"
    },
    {
      "nome": "Carlos Mendes",
      "matricula": "2021007890",
      "curso": "Engenharia de Software"
    }
  ]'
```

#### Ativar Eleição
```bash
curl -X POST http://localhost:3000/admin/eleicoes/ELEICAO_ID/ativar \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI"
```

#### Encerrar Eleição
```bash
curl -X POST http://localhost:3000/admin/eleicoes/ELEICAO_ID/encerrar \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI"
```

#### Ver Resultados
```bash
curl -X GET http://localhost:3000/admin/eleicoes/ELEICAO_ID/resultado \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI"
```

**Resposta:**
```json
{
  "eleicao": {
    "id": "eleicao-uuid",
    "nome": "Eleição para Representante Estudantil 2025",
    "status": "Encerrada"
  },
  "resultados": [
    {
      "chapa": {
        "id": "chapa-uuid-1",
        "nome": "Chapa Renovação"
      },
      "votos": 15
    },
    {
      "chapa": {
        "id": "chapa-uuid-2",
        "nome": "Chapa União"
      },
      "votos": 8
    }
  ],
  "totalVotos": 23,
  "totalEleitores": 30
}
```

### 👨‍⚖️ Mesário

#### Buscar Eleitor
```bash
curl -X GET http://localhost:3000/mesario/eleitor/2021001234 \
  -H "Authorization: Bearer SEU_TOKEN_MESARIO_AQUI"
```

**Resposta:**
```json
{
  "eleitor": {
    "id": "eleitor-uuid",
    "nome": "João Silva",
    "matricula": "2021001234",
    "curso": "Ciência da Computação",
    "jaVotou": false
  },
  "status": "Apto a Votar"
}
```

#### Habilitar Eleitor
```bash
curl -X POST http://localhost:3000/mesario/habilitar \
  -H "Authorization: Bearer SEU_TOKEN_MESARIO_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "2021001234"
  }'
```

**Resposta:**
```json
{
  "message": "Eleitor habilitado com sucesso",
  "credencial": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

#### Status da Urna
```bash
curl -X GET http://localhost:3000/urna/status \
  -H "Authorization: Bearer SEU_TOKEN_MESARIO_AQUI"
```

### 🗳️ Urna Eletrônica

#### Validar Credencial
```bash
curl -X POST http://localhost:3000/urna/validar-credencial \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }'
```

**Resposta:**
```json
{
  "message": "Credencial válida",
  "valid": true
}
```

#### Listar Chapas
```bash
curl -X GET "http://localhost:3000/urna/chapas?eleicaoId=ELEICAO_ID"
```

**Resposta:**
```json
[
  {
    "id": "chapa-uuid-1",
    "nome": "Chapa Renovação",
    "descricao": "Chapa comprometida com a renovação..."
  },
  {
    "id": "chapa-uuid-2",
    "nome": "Chapa União",
    "descricao": "Chapa focada na união dos estudantes"
  }
]
```

#### Confirmar Voto
```bash
curl -X POST http://localhost:3000/urna/confirmar \
  -H "Content-Type: application/json" \
  -d '{
    "eleicaoId": "eleicao-uuid",
    "chapaId": "chapa-uuid-1",
    "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }'
```

**Resposta:**
```json
{
  "message": "Voto registrado com sucesso!"
}
```

### 🔍 Sistema

#### Health Check
```bash
curl -X GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T06:04:07.868Z",
  "service": "Sistema de Votação Eletrônica - TCC UNIRIO"
}
```

#### Validar Identidade
```bash
curl -X POST http://localhost:3000/identidade/validar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "documento": "12345678901"
  }'
```

**Resposta:**
```json
{
  "message": "Identidade validada com sucesso.",
  "valid": true
}
```

### ❌ Exemplos de Erros

#### Token Inválido
```bash
curl -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer token_invalido" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste"}'
```

**Resposta:**
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

#### Role Insuficiente
```bash
curl -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer TOKEN_MESARIO" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste"}'
```

**Resposta:**
```json
{
  "statusCode": 401,
  "message": "Acesso negado. Role necessária: admin",
  "error": "Unauthorized"
}
```

#### Credenciais Inválidas
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vota-ai.com",
    "senha": "senha_errada"
  }'
```

**Resposta:**
```json
{
  "error": "Credenciais inválidas"
}
```

### 🔄 Fluxo Completo de Votação

#### 1. Administrador cria eleição
```bash
# Login admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vota-ai.com","senha":"admin123"}' | \
  jq -r '.token')

# Criar eleição
ELEICAO_ID=$(curl -s -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eleição Teste","descricao":"Teste do sistema"}' | \
  jq -r '.eleicao.id')

# Criar chapa
curl -X POST http://localhost:3000/admin/chapas \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Chapa Teste\",\"eleicaoId\":\"$ELEICAO_ID\"}"

# Ativar eleição
curl -X POST http://localhost:3000/admin/eleicoes/$ELEICAO_ID/ativar \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 2. Mesário habilita eleitor
```bash
# Login mesário
MESARIO_TOKEN=$(curl -s -X POST http://localhost:3000/mesario/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"mesario01","senha":"mesario123"}' | \
  jq -r '.token')

# Habilitar eleitor
CREDENCIAL=$(curl -s -X POST http://localhost:3000/mesario/habilitar \
  -H "Authorization: Bearer $MESARIO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"matricula":"2021001234"}' | \
  jq -r '.credencial')
```

#### 3. Eleitor vota
```bash
# Validar credencial
curl -X POST http://localhost:3000/urna/validar-credencial \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$CREDENCIAL\"}"

# Listar chapas
curl -X GET "http://localhost:3000/urna/chapas?eleicaoId=$ELEICAO_ID"

# Confirmar voto
curl -X POST http://localhost:3000/urna/confirmar \
  -H "Content-Type: application/json" \
  -d "{\"eleicaoId\":\"$ELEICAO_ID\",\"chapaId\":\"CHAPA_ID\",\"token\":\"$CREDENCIAL\"}"
```

### 🛠️ Ferramentas Úteis

#### Usando PowerShell (Windows)
```powershell
# Login admin
$response = Invoke-RestMethod -Uri "http://localhost:3000/admin/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@vota-ai.com","senha":"admin123"}'
$token = $response.token

# Criar eleição
$body = @{
    nome = "Eleição PowerShell"
    descricao = "Teste via PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/admin/eleicoes" -Method POST -Headers @{"Authorization"="Bearer $token"} -ContentType "application/json" -Body $body
```

#### Usando JavaScript (Node.js)
```javascript
const axios = require('axios');

async function exemploCompleto() {
  try {
    // Login admin
    const loginResponse = await axios.post('http://localhost:3000/admin/login', {
      email: 'admin@vota-ai.com',
      senha: 'admin123'
    });
    
    const token = loginResponse.data.token;
    
    // Criar eleição
    const eleicaoResponse = await axios.post('http://localhost:3000/admin/eleicoes', {
      nome: 'Eleição JavaScript',
      descricao: 'Teste via JavaScript'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Eleição criada:', eleicaoResponse.data);
    
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

exemploCompleto();
```

---

## 🔐 Sistema de Permissionamento

### Estrutura de Usuários
```typescript
// Administrador
{
  id: string
  nome: string
  email: string (único)
  senha: string
  role: 'admin'
}

// Mesário
{
  id: string
  nome: string
  usuario: string (único)
  senha: string
  role: 'mesario'
}
```

### Fluxo de Autenticação
```
1. Login → Validação de credenciais
2. Geração de JWT com role
3. Token enviado no header Authorization
4. Guards validam token e role
5. Acesso liberado ou negado
```

### Matriz de Permissões
| Funcionalidade | Admin | Mesário | Público |
|----------------|-------|---------|---------|
| Criar Eleição | ✅ | ❌ | ❌ |
| Ativar Eleição | ✅ | ❌ | ❌ |
| Ver Resultados | ✅ | ❌ | ❌ |
| Buscar Eleitor | ❌ | ✅ | ❌ |
| Habilitar Eleitor | ❌ | ✅ | ❌ |
| Validar Credencial | ❌ | ❌ | ✅ |
| Confirmar Voto | ❌ | ❌ | ✅ |

---

## 🗄️ Banco de Dados

### Schema Principal
```sql
-- Administradores
CREATE TABLE "Administrador" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR NOT NULL,
  email     VARCHAR UNIQUE NOT NULL,
  senha     VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Mesários
CREATE TABLE "Mesario" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR NOT NULL,
  usuario   VARCHAR UNIQUE NOT NULL,
  senha     VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Eleições
CREATE TABLE "Eleicao" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR NOT NULL,
  descricao   VARCHAR,
  ativa       BOOLEAN DEFAULT FALSE,
  status      VARCHAR DEFAULT 'Criada',
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);

-- Eleitores
CREATE TABLE "Eleitor" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR NOT NULL,
  matricula VARCHAR UNIQUE NOT NULL,
  jaVotou   BOOLEAN DEFAULT FALSE,
  eleicaoId UUID REFERENCES "Eleicao"(id)
);

-- Chapas
CREATE TABLE "Chapa" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR NOT NULL,
  descricao VARCHAR,
  eleicaoId UUID REFERENCES "Eleicao"(id)
);

-- Credenciais
CREATE TABLE "Credencial" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token     VARCHAR UNIQUE NOT NULL,
  usada     BOOLEAN DEFAULT FALSE,
  eleitorId UUID REFERENCES "Eleitor"(id),
  eleicaoId UUID REFERENCES "Eleicao"(id)
);

-- Votos
CREATE TABLE "Voto" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleicaoId UUID REFERENCES "Eleicao"(id),
  chapaId   UUID REFERENCES "Chapa"(id),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Dados Iniciais
```sql
-- Administrador padrão
INSERT INTO "Administrador" (nome, email, senha) 
VALUES ('Administrador Vota Ai', 'admin@vota-ai.com', 'admin123');

-- Mesário padrão
INSERT INTO "Mesario" (nome, usuario, senha)
VALUES ('Mesário Vota Ai', 'mesario01', 'mesario123');
```

---

## 🐳 Docker

### Estrutura de Containers
```yaml
services:
  postgres:    # Banco PostgreSQL
  backend:     # API NestJS
  nginx:       # Proxy reverso
```

### Comandos Úteis
```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f backend

# Parar sistema
docker-compose down

# Limpar dados
docker-compose down -v

# Rebuild específico
docker-compose build backend
```

### Variáveis de Ambiente
```bash
# Banco de dados
POSTGRES_USER=votaai
POSTGRES_PASSWORD=votaai123
POSTGRES_DB=vota_ai_db
DATABASE_URL=postgres://votaai:votaai123@postgres:5432/vota_ai_db

# Aplicação
NODE_ENV=production
PORT=3000
JWT_SECRET=vota-ai-secret-key-tcc
```

---

## 🧪 Testes

### Testes de API
```bash
# Health Check
curl http://localhost:3000/health

# Login Admin
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vota-ai.com","senha":"admin123"}'

# Login Mesário
curl -X POST http://localhost:3000/mesario/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"mesario01","senha":"mesario123"}'

# Criar Eleição (com token)
curl -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eleição Teste","descricao":"Teste do sistema"}'
```

### Cenários de Teste
1. ✅ **Login Admin**: Credenciais válidas retornam token
2. ✅ **Login Mesário**: Credenciais válidas retornam token
3. ✅ **Acesso Negado**: Token inválido retorna 401
4. ✅ **Role Insuficiente**: Mesário não pode criar eleições
5. ✅ **Endpoints Públicos**: Urna funciona sem autenticação

---

## 🛠️ Tecnologias

### Backend
- **NestJS**: Framework Node.js para APIs
- **TypeScript**: Linguagem de programação
- **Prisma**: ORM para banco de dados
- **JWT**: Autenticação com tokens
- **Passport**: Estratégias de autenticação

### Banco de Dados
- **PostgreSQL**: Banco relacional
- **Prisma Client**: Cliente ORM
- **UUID**: Identificadores únicos

### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Nginx**: Proxy reverso
- **Alpine Linux**: Imagens otimizadas

### Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Git**: Controle de versão

---

## 📊 Status Final de Implementação

| Componente | Status | Descrição |
|------------|--------|-----------|
| **Backend API** | ✅ 100% | Todos os endpoints implementados |
| **Autenticação** | ✅ 100% | JWT com roles funcionando |
| **Banco de Dados** | ✅ 100% | Schema completo e dados iniciais |
| **Docker** | ✅ 100% | Containers funcionando |
| **Requisitos Funcionais** | ✅ 100% | RF01-RF15 implementados |
| **Regras de Negócio** | ✅ 100% | RN01-RN13 implementadas |
| **Permissionamento** | ✅ 100% | Guards e roles funcionando |
| **Health Check** | ✅ 100% | Monitoramento ativo |
| **Documentação** | ✅ 100% | README completo |

---

## 🎯 Próximos Passos

### Para Desenvolvimento
1. **Frontend**: Desenvolver interface web/mobile
2. **Testes**: Implementar testes automatizados
3. **Logs**: Sistema de auditoria completo
4. **Backup**: Estratégia de backup do banco
5. **SSL**: Certificados HTTPS para produção

### Para Produção
1. **Deploy**: Configurar ambiente de produção
2. **Monitoramento**: Logs e métricas
3. **Segurança**: Auditoria de segurança
4. **Performance**: Otimizações de banco
5. **Escalabilidade**: Load balancing

---

## 📞 Suporte

### Credenciais Padrão
- **Admin**: `admin@vota-ai.com` / `admin123`
- **Mesário**: `mesario01` / `mesario123`

### URLs Importantes
- **API**: `http://localhost:3000`
- **Health**: `http://localhost:3000/health`
- **Docs**: `http://localhost:3000/api` (se implementado)

### Logs e Debug
```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do banco
docker-compose logs -f postgres

# Acessar container
docker exec -it vota-ai-backend sh
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso (TCC).

---

**Sistema Vota Ai - Desenvolvido com ❤️ para TCC UNIRIO**

*Última atualização: Outubro 2025*
