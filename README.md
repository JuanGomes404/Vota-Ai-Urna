# 🗳️ Vota Ai - Sistema de Votação Eletrônica

Sistema completo de votação eletrônica desenvolvido para TCC, implementando todos os requisitos funcionais e regras de negócio necessárias para um processo eleitoral seguro e transparente.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Instalação e Execução](#-instalação-e-execução)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Requisitos e Regras](#-requisitos-e-regras)
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

### 📋 Containers do Sistema

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

### 🔐 Sistema de Autenticação
- **JWT Tokens** com expiração de 8 horas
- **Roles**: Admin e Mesário com permissões específicas
- **Guards de Segurança** protegendo endpoints
- **Validação de Credenciais** em tempo real

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

### 🔐 Autenticação
```http
POST /admin/login              # Login administrador
POST /mesario/login            # Login mesário
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

#### Login do Mesário
```bash
curl -X POST http://localhost:3000/mesario/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "mesario01",
    "senha": "mesario123"
  }'
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

# Confirmar voto
curl -X POST http://localhost:3000/urna/confirmar \
  -H "Content-Type: application/json" \
  -d "{\"eleicaoId\":\"$ELEICAO_ID\",\"chapaId\":\"CHAPA_ID\",\"token\":\"$CREDENCIAL\"}"
```

---

## 📋 Requisitos e Regras

### ✅ Requisitos Funcionais Implementados

| RF | Descrição | Status |
|----|-----------|--------|
| **RF01** | Sistema deve permitir login de administrador | ✅ |
| **RF02** | Sistema deve permitir login de mesário | ✅ |
| **RF03** | Administrador deve criar eleições | ✅ |
| **RF04** | Administrador deve criar chapas | ✅ |
| **RF05** | Administrador deve importar eleitores | ✅ |
| **RF06** | Administrador deve ativar eleições | ✅ |
| **RF07** | Administrador deve encerrar eleições | ✅ |
| **RF08** | Administrador deve visualizar resultados | ✅ |
| **RF09** | Mesário deve buscar eleitores | ✅ |
| **RF10** | Mesário deve habilitar eleitores | ✅ |
| **RF11** | Sistema deve validar credenciais | ✅ |
| **RF12** | Sistema deve listar chapas | ✅ |
| **RF13** | Sistema deve confirmar votos | ✅ |
| **RF14** | Sistema deve validar identidade | ✅ |
| **RF15** | Sistema deve fornecer health check | ✅ |

### ✅ Regras de Negócio Implementadas

| RN | Descrição | Status |
|----|-----------|--------|
| **RN01** | Apenas administradores podem criar eleições | ✅ |
| **RN02** | Eleição deve ter lista de eleitores | ✅ |
| **RN03** | Apenas administradores podem ativar eleições | ✅ |
| **RN04** | Resultados só após eleição encerrada | ✅ |
| **RN05** | Apenas eleitores da lista podem ser habilitados | ✅ |
| **RN06** | Eleitor não pode votar duas vezes | ✅ |
| **RN07** | Credencial deve ser de uso único | ✅ |
| **RN08** | Mesário deve verificar habilitação | ✅ |
| **RN09** | Credencial deve ser válida para votação | ✅ |
| **RN10** | Voto deve ser anônimo | ✅ |
| **RN11** | Sistema deve registrar timestamp | ✅ |
| **RN12** | Sistema deve validar dados | ✅ |
| **RN13** | Sistema não deve armazenar dados identificadores | ✅ |

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

## 🐳 Docker

### Comandos Principais

```bash
# Subir sistema completo
docker-compose up --build

# Em background
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar sistema
docker-compose down

# Parar e limpar dados
docker-compose down -v
```

### Desenvolvimento

```bash
# Usar configuração de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build
```

### Monitoramento

```bash
# Health check
curl http://localhost:3000/health

# Estatísticas dos containers
docker stats

# Logs específicos
docker-compose logs backend
docker-compose logs postgres
```

---

## 🧪 Testes

### Health Check
```bash
curl http://localhost:3000/health
```

### Teste de Login
```bash
# Admin
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vota-ai.com","senha":"admin123"}'

# Mesário
curl -X POST http://localhost:3000/mesario/login \
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

## 📞 Suporte

### Logs Importantes
```bash
# Logs de inicialização
docker-compose logs backend | head -50

# Logs de erro
docker-compose logs backend | grep -i error

# Logs do banco
docker-compose logs postgres | tail -20
```

### Informações para Suporte
```bash
# Versão do Docker
docker --version

# Status dos containers
docker-compose ps

# Configuração do sistema
docker-compose config
```

---

**🎉 Sistema Vota Ai está pronto para uso!**

Para mais informações técnicas, consulte os arquivos de documentação específicos no projeto.