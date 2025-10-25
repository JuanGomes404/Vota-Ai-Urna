# 🗳️ Vota Ai - Sistema de Votação Eletrônica

Sistema completo de votação eletrônica desenvolvido para TCC, implementando todos os requisitos funcionais e regras de negócio necessárias para um processo eleitoral seguro e transparente.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Instalação e Execução](#-instalação-e-execução)
- [API Endpoints](#-api-endpoints)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Tecnologias](#-tecnologias)

---

## 🎯 Visão Geral

O **Vota Ai** é um sistema de votação eletrônica completo que permite a realização de eleições de forma segura, transparente e eficiente. O sistema implementa dois níveis de acesso (Administrador e Mesário) com funcionalidades específicas para cada papel.

### Características Principais
- ✅ **Sistema Monolítico** unificado para facilitar desenvolvimento e manutenção
- ✅ **Login Unificado** - Um único endpoint para admin e mesário
- ✅ **Permissionamento Robusto** com JWT e roles
- ✅ **Votação Anônima** garantindo privacidade do eleitor
- ✅ **Credenciais de Uso Único** para máxima segurança
- ✅ **Interface RESTful** para integração com frontend
- ✅ **Containerização Docker** para fácil deploy

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

### � Alternar entre banco local e Render (produção)

O backend agora seleciona automaticamente a URL do banco com base nas variáveis de ambiente:

- Em desenvolvimento (DB_ENV=local ou NODE_ENV=development), usa `DATABASE_URL`.
- Em produção (DB_ENV=prod ou NODE_ENV=production), usa `DATABASE_URL_PROD` quando definido; caso contrário, usa `DATABASE_URL`.

Arquivos de exemplo:

- `backend/.env.example` (desenvolvimento)
- `backend/.env.production.example` (produção/Render)

Uso sugerido:

```powershell
# Local (usando Postgres do compose)
cp backend/.env.example backend/.env
# Edite backend/.env se necessário. Depois:
docker build -f Dockerfile.backend -t vota-ai-backend .
docker run --rm -p 3000:3000 --env-file backend/.env vota-ai-backend

# Produção (Render)
# Configure as variáveis na plataforma Render (Dashboard → Environment):
# - NODE_ENV=production
# - DB_ENV=prod (opcional)
# - DATABASE_URL=postgresql://<render-connection-string>
# - JWT_SECRET=<sua-chave-secreta>
# Opcional: DATABASE_URL_PROD para separar da local.
```

Segurança de migrações:

- Em produção, o container executa somente `prisma migrate deploy` (sem `migrate dev`).
- O seed SQL (`database/init-data.sql`) só roda em desenvolvimento.

### �📋 Containers do Sistema

| Container | Nome | Porta | Descrição |
|-----------|------|-------|-----------|
| **PostgreSQL** | `vota-ai-postgres` | 5432 | Banco de dados principal |
| **Backend** | `vota-ai-backend` | 3000 | API NestJS |
| **Nginx** | `vota-ai-nginx` | 80/443 | Proxy reverso (opcional) |

### 🌐 URLs de Acesso

- **API Backend**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`
- **Banco de Dados**: `localhost:5432`
- **Proxy Nginx**: `http://localhost:80`

### 🔐 Credenciais Padrão

#### **Banco de Dados**
- **Host**: `localhost:5432`
- **Database**: `vota_ai_db`
- **User**: `votaai`
- **Password**: `votaai123`

#### **Sistema**
- **Admin**: `admin@vota-ai.com` / `admin123`
- **Mesário**: `mesario01` / `mesario123`

---

## ⚙️ Funcionalidades

### 🔐 Sistema de Autenticação Unificado
- **Login Unificado** - Um único endpoint para admin e mesário
- **JWT Tokens** com expiração de 8 horas
- **Roles**: Admin e Mesário com permissões específicas
- **Guards de Segurança** protegendo endpoints
- **Validação Automática** de tipo de usuário baseado nas credenciais

### 👨‍💼 Administrador
- **Criar Eleições** com nome e descrição
- **Gerenciar Chapas** para cada eleição
- **Importar Eleitores** em lote (nome, matrícula, curso)
- **Ativar/Encerrar Eleições** controlando o processo
- **Visualizar Resultados** após encerramento

### 👨‍⚖️ Mesário
- **Buscar Eleitores** por matrícula
- **Habilitar Eleitores** gerando credenciais únicas
- **Verificar Status** da urna eletrônica
- **Validar Credenciais** antes da votação

### 🗳️ Urna Eletrônica
- **Validação de Credenciais** de uso único
- **Listagem de Chapas** disponíveis
- **Confirmação de Voto** anônima
- **Invalidação Automática** de credenciais

---

## 📡 API Endpoints

### 🔐 Autenticação Unificada
```http
POST /auth/login               # Login unificado (admin/mesário)
```

### 👨‍💼 Administrador (Protegido)
```http
POST /admin/eleicoes           # Criar eleição
POST /admin/chapas             # Criar chapa
POST /admin/eleitores/importar # Importar eleitores
POST /admin/eleicoes/:id/ativar    # Ativar eleição
POST /admin/eleicoes/:id/encerrar  # Encerrar eleição
GET  /admin/eleicoes/:id/resultado # Ver resultados
```

### 👨‍⚖️ Mesário (Protegido)
```http
GET  /mesario/eleitor/:matricula   # Buscar eleitor
POST /mesario/habilitar            # Habilitar eleitor
GET  /urna/status                  # Status da urna
```

### 🗳️ Urna (Público)
```http
POST /urna/validar-credencial     # Validar credencial
GET  /urna/chapas                # Listar chapas
POST /urna/confirmar             # Confirmar voto
```

### 🔍 Sistema
```http
GET  /health                     # Health check
POST /identidade/validar         # Validar identidade
```

---

## 📡 Exemplos de Uso

### 🔐 Autenticação Unificada

#### Login Unificado (Admin ou Mesário)
```bash
# Login como Administrador (usando email)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin@vota-ai.com",
    "senha": "admin123"
  }'
```

```bash
# Login como Mesário (usando usuário)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "mesario01",
    "senha": "mesario123"
  }'
```

**Resposta Unificada:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "nome": "Nome do Usuário",
    "email": "admin@vota-ai.com",     // apenas para admin
    "usuario": "mesario01",           // apenas para mesário
    "role": "admin"                   // ou "mesario"
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
    }
  ]'
```

### 👨‍⚖️ Mesário

#### Buscar Eleitor
```bash
curl -X GET http://localhost:3000/mesario/eleitor/2021001234 \
  -H "Authorization: Bearer SEU_TOKEN_MESARIO_AQUI"
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

### 🗳️ Urna Eletrônica

#### Validar Credencial
```bash
curl -X POST http://localhost:3000/urna/validar-credencial \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }'
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

### 🔄 Fluxo Completo de Votação

#### 1. Administrador cria eleição
```bash
# Login admin (usando endpoint unificado)
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin@vota-ai.com","senha":"admin123"}' | \
  jq -r '.token')

# Criar eleição
ELEICAO_ID=$(curl -s -X POST http://localhost:3000/admin/eleicoes \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eleição Teste","descricao":"Teste do sistema"}' | \
  jq -r '.eleicao.id')

# Ativar eleição
curl -X POST http://localhost:3000/admin/eleicoes/$ELEICAO_ID/ativar \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 2. Mesário habilita eleitor
```bash
# Login mesário (usando endpoint unificado)
MESARIO_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
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

# Confirmar voto
curl -X POST http://localhost:3000/urna/confirmar \
  -H "Content-Type: application/json" \
  -d "{\"eleicaoId\":\"$ELEICAO_ID\",\"chapaId\":\"CHAPA_ID\",\"token\":\"$CREDENCIAL\"}"
```

---

## 🗄️ Banco de Dados

### Schema Principal

```sql
-- Eleições
Eleicao {
  id: String (UUID)
  nome: String
  descricao: String?
  ativa: Boolean
  status: String (Criada/Ativa/Encerrada)
  createdAt: DateTime
  updatedAt: DateTime
}

-- Chapas
Chapa {
  id: String (UUID)
  nome: String
  eleicaoId: String (FK)
}

-- Eleitores
Eleitor {
  id: String (UUID)
  nome: String
  matricula: String (Unique)
  curso: String
  eleicaoId: String (FK)
  jaVotou: Boolean
}

-- Credenciais
Credencial {
  id: String (UUID)
  eleitorId: String (FK)
  eleicaoId: String (FK)
  token: String (Unique)
  usada: Boolean
}

-- Votos
Voto {
  id: String (UUID)
  eleicaoId: String (FK)
  chapaId: String (FK)
  timestamp: DateTime
}

-- Usuários do Sistema
Administrador {
  id: String (UUID)
  nome: String
  email: String (Unique)
  senha: String
}

Mesario {
  id: String (UUID)
  nome: String
  usuario: String (Unique)
  senha: String
}
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

### Fluxo de Autenticação Unificado
```
1. Login único → POST /auth/login
2. Sistema tenta validar como admin primeiro (email)
3. Se não encontrar, tenta validar como mesário (usuário)
4. Geração de JWT com role determinado automaticamente
5. Token enviado no header Authorization
6. Guards validam token e role
7. Acesso liberado ou negado
```

### Matriz de Permissões

| Funcionalidade | Admin | Mesário | Público |
|----------------|-------|---------|---------|
| **Criar Eleição** | ✅ | ❌ | ❌ |
| **Criar Chapa** | ✅ | ❌ | ❌ |
| **Importar Eleitores** | ✅ | ❌ | ❌ |
| **Ativar Eleição** | ✅ | ❌ | ❌ |
| **Encerrar Eleição** | ✅ | ❌ | ❌ |
| **Ver Resultados** | ✅ | ❌ | ❌ |
| **Buscar Eleitor** | ❌ | ✅ | ❌ |
| **Habilitar Eleitor** | ❌ | ✅ | ❌ |
| **Status da Urna** | ❌ | ✅ | ❌ |
| **Validar Credencial** | ❌ | ❌ | ✅ |
| **Listar Chapas** | ❌ | ❌ | ✅ |
| **Confirmar Voto** | ❌ | ❌ | ✅ |

---

## 🧪 Testes

### Health Check
```bash
curl http://localhost:3000/health
```

### Teste de Login Unificado
```bash
# Login como Administrador
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin@vota-ai.com","senha":"admin123"}'

# Login como Mesário
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"mesario01","senha":"mesario123"}'
```

### Teste de Banco
```bash
# Conectar ao PostgreSQL
docker exec -it vota-ai-postgres psql -U votaai -d vota_ai_db

# Listar tabelas
\dt

# Verificar dados
SELECT * FROM "Administrador";
SELECT * FROM "Mesario";
```

---

## 🛠️ Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem principal
- **Prisma** - ORM para banco de dados
- **JWT** - Autenticação e autorização
- **Passport** - Estratégias de autenticação

### Banco de Dados
- **PostgreSQL** - Banco relacional
- **Prisma Client** - Acesso aos dados
- **Migrations** - Controle de versão do schema

### Containerização
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Multi-stage Build** - Otimização de imagens

### Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação
- **Git** - Controle de versão

---

**🎉 Sistema Vota Ai está pronto para uso!**

Para mais informações técnicas, consulte os arquivos de documentação específicos no projeto.