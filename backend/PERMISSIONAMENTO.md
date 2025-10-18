# 🔐 Sistema de Permissionamento - Vota Ai

## **📋 Visão Geral**

O sistema implementa um **permissionamento robusto mas simples** baseado em **JWT (JSON Web Tokens)** com **roles** (papéis) para controlar o acesso às funcionalidades do sistema de votação eletrônica.

---

## **🏗️ Arquitetura do Sistema**

### **1. Estrutura de Usuários**
```typescript
// Dois tipos de usuários com tabelas separadas
Administrador {
  id: string
  nome: string
  email: string (único)
  senha: string
  role: 'admin'
}

Mesario {
  id: string
  nome: string
  usuario: string (único)
  senha: string
  role: 'mesario'
}
```

### **2. Fluxo de Autenticação**
```
1. Login → Validação de credenciais
2. Geração de JWT com role
3. Token enviado no header Authorization
4. Guards validam token e role
5. Acesso liberado ou negado
```

---

## **🛡️ Componentes de Segurança**

### **1. AuthService**
- **Validação de credenciais** (admin/mesário)
- **Geração de tokens JWT**
- **Validação de tokens**

### **2. Guards**
- **JwtAuthGuard**: Verifica se token é válido
- **RolesGuard**: Verifica se usuário tem role necessária

### **3. Decorators**
- **@AdminOnly()**: Apenas administradores
- **@MesarioOnly()**: Apenas mesários
- **@AdminOrMesario()**: Ambos os roles
- **@AuthRequired()**: Apenas autenticação

---

## **🔒 Matriz de Permissões**

| Funcionalidade | Admin | Mesário | Público |
|----------------|-------|---------|---------|
| **Login** | ✅ | ✅ | ❌ |
| **Criar Eleição** | ✅ | ❌ | ❌ |
| **Criar Chapa** | ✅ | ❌ | ❌ |
| **Importar Eleitores** | ✅ | ❌ | ❌ |
| **Ativar Eleição** | ✅ | ❌ | ❌ |
| **Encerrar Eleição** | ✅ | ❌ | ❌ |
| **Ver Resultados** | ✅ | ❌ | ❌ |
| **Buscar Eleitor** | ❌ | ✅ | ❌ |
| **Habilitar Eleitor** | ❌ | ✅ | ❌ |
| **Validar Credencial** | ❌ | ❌ | ✅ |
| **Listar Chapas** | ❌ | ❌ | ✅ |
| **Confirmar Voto** | ❌ | ❌ | ✅ |
| **Status Urna** | ❌ | ✅ | ❌ |

---

## **📡 Endpoints Protegidos**

### **Administrador (`/admin/*`)**
```typescript
// Todos os endpoints requerem: Authorization: Bearer <token>
// Token deve conter role: 'admin'

POST /admin/login              // Login (sem proteção)
POST /admin/eleicoes           // @AdminOnly()
POST /admin/chapas             // @AdminOnly()
POST /admin/eleitores/importar // @AdminOnly()
POST /admin/eleicoes/:id/ativar    // @AdminOnly()
POST /admin/eleicoes/:id/encerrar  // @AdminOnly()
GET  /admin/eleicoes/:id/resultado // @AdminOnly()
```

### **Mesário (`/mesario/*`)**
```typescript
// Todos os endpoints requerem: Authorization: Bearer <token>
// Token deve conter role: 'mesario'

POST /mesario/login            // Login (sem proteção)
GET  /mesario/eleitor/:matricula // @MesarioOnly()
POST /mesario/habilitar        // @MesarioOnly()
```

### **Urna (`/urna/*`)**
```typescript
// Endpoints públicos (sem autenticação)
POST /urna/validar-credencial  // Público
GET  /urna/chapas             // Público
POST /urna/confirmar          // Público

// Endpoints protegidos
GET  /urna/status             // @MesarioOnly()
```

---

## **🔑 Como Usar o Sistema**

### **1. Login do Administrador**
```bash
POST /admin/login
Content-Type: application/json

{
  "email": "admin@sue.com",
  "senha": "admin123"
}

# Resposta:
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "nome": "Administrador",
    "email": "admin@sue.com",
    "role": "admin"
  }
}
```

### **2. Usar Token em Requisições**
```bash
POST /admin/eleicoes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nome": "Eleição 2024",
  "descricao": "Eleição para representante estudantil"
}
```

### **3. Login do Mesário**
```bash
POST /mesario/login
Content-Type: application/json

{
  "usuario": "mesario01",
  "senha": "mesario123"
}

# Resposta:
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "nome": "Mesário 01",
    "usuario": "mesario01",
    "role": "mesario"
  }
}
```

---

## **⚠️ Cenários de Erro**

### **1. Token Inválido**
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

### **2. Token Ausente**
```json
{
  "statusCode": 401,
  "message": "Token de autenticação necessário",
  "error": "Unauthorized"
}
```

### **3. Role Insuficiente**
```json
{
  "statusCode": 401,
  "message": "Acesso negado. Role necessária: admin",
  "error": "Unauthorized"
}
```

### **4. Credenciais Inválidas**
```json
{
  "error": "Credenciais inválidas"
}
```

---

## **🔧 Configuração**

### **Variáveis de Ambiente**
```bash
# Arquivo .env
JWT_SECRET=vota-ai-secret-key-tcc
JWT_EXPIRES_IN=8h
```

### **Dependências**
```json
{
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.1"
}
```

---

## **🎯 Benefícios do Sistema**

### **✅ Segurança**
- **Tokens JWT** com expiração
- **Validação de roles** em tempo real
- **Separação clara** de responsabilidades

### **✅ Simplicidade**
- **Decorators simples** para proteger endpoints
- **Código limpo** e fácil de entender
- **Manutenção facilitada**

### **✅ Flexibilidade**
- **Fácil adição** de novos roles
- **Controle granular** de permissões
- **Extensível** para futuras funcionalidades

---

## **📊 Resumo da Implementação**

| Componente | Status | Descrição |
|------------|--------|-----------|
| **JWT Service** | ✅ Implementado | Geração e validação de tokens |
| **Auth Guards** | ✅ Implementado | Controle de acesso |
| **Role Guards** | ✅ Implementado | Validação de permissões |
| **Decorators** | ✅ Implementado | Simplificação do uso |
| **Controllers** | ✅ Atualizados | Todos protegidos adequadamente |
| **Documentação** | ✅ Completa | Guia de uso e configuração |

---

## **🚀 Próximos Passos**

1. **Testar** o sistema com diferentes usuários
2. **Configurar** variáveis de ambiente
3. **Implementar** logout (invalidação de token)
4. **Adicionar** logs de auditoria
5. **Considerar** refresh tokens para sessões longas

O sistema agora possui **permissionamento robusto** mantendo a **simplicidade** necessária para um projeto de TCC! 🎉
