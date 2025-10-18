# 🐳 Docker Setup - Vota Ai

Este documento explica como executar o sistema completo usando Docker.

## 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose v2.0+
- Portas 3000, 5432, 80 disponíveis

## 🚀 Execução Rápida - Vota Ai

### 1. Subir todos os serviços
```bash
docker-compose up --build
```

### 2. Executar em background
```bash
docker-compose up -d --build
```

### 3. Ver logs
```bash
docker-compose logs -f backend
docker-compose logs -f postgres
```

## 🏗️ Arquitetura dos Serviços

### **PostgreSQL Database**
- **Container**: `sue-postgres`
- **Porta**: 5432
- **Banco**: `sue_db`
- **Usuário**: `sue`
- **Senha**: `suepass`
- **Volume**: `postgres_data`

### **Backend API**
- **Container**: `sue-backend`
- **Porta**: 3000
- **Health Check**: `http://localhost:3000/health`
- **Build**: Multi-stage para otimização

### **Nginx Proxy** (Opcional)
- **Container**: `sue-nginx`
- **Porta**: 80 (HTTP), 443 (HTTPS)
- **Proxy**: Para o backend

## 🔧 Comandos Úteis

### **Gerenciamento de Containers**
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild apenas o backend
docker-compose build backend

# Executar comandos no container
docker-compose exec backend sh
docker-compose exec postgres psql -U sue -d sue_db
```

### **Logs e Debugging**
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs postgres

# Ver status dos containers
docker-compose ps
```

### **Banco de Dados**
```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U sue -d sue_db

# Backup do banco
docker-compose exec postgres pg_dump -U sue sue_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U sue sue_db < backup.sql
```

## 🔍 Health Checks

### **Backend Health Check**
```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T02:08:00.000Z",
  "service": "Sistema de Votação Eletrônica - TCC UNIRIO"
}
```

### **PostgreSQL Health Check**
```bash
docker-compose exec postgres pg_isready -U sue -d sue_db
```

## 📊 Monitoramento

### **Status dos Serviços**
```bash
# Verificar status
docker-compose ps

# Verificar health checks
docker inspect sue-backend | grep Health -A 10
docker inspect sue-postgres | grep Health -A 10
```

### **Recursos**
```bash
# Uso de recursos
docker stats

# Uso de recursos de um container específico
docker stats sue-backend sue-postgres
```

## 🛠️ Desenvolvimento

### **Modo Desenvolvimento**
```bash
# Executar apenas o banco
docker-compose up postgres

# Executar backend localmente
cd backend
npm run start:dev
```

### **Hot Reload**
Para desenvolvimento com hot reload, execute o backend localmente:
```bash
cd backend
npm run start:dev
```

E apenas o banco via Docker:
```bash
docker-compose up postgres
```

## 🔒 Segurança

### **Usuários Padrão Criados**

**Administrador:**
- Email: `admin@sue.com`
- Senha: `admin123`

**Mesário:**
- Usuário: `mesario`
- Senha: `mesario123`

⚠️ **IMPORTANTE**: Altere essas senhas em produção!

### **Variáveis de Ambiente**
```bash
# Para produção, crie um arquivo .env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha_forte
POSTGRES_DB=seu_banco
```

## 🐛 Troubleshooting

### **Problemas Comuns**

1. **Porta já em uso**
   ```bash
   # Verificar processos usando a porta
   netstat -ano | findstr :3000
   netstat -ano | findstr :5432
   ```

2. **Container não inicia**
   ```bash
   # Ver logs detalhados
   docker-compose logs backend
   docker-compose logs postgres
   ```

3. **Banco não conecta**
   ```bash
   # Verificar se PostgreSQL está rodando
   docker-compose exec postgres pg_isready
   
   # Testar conexão
   docker-compose exec backend npm run start
   ```

4. **Build falha**
   ```bash
   # Limpar cache do Docker
   docker system prune -a
   
   # Rebuild sem cache
   docker-compose build --no-cache
   ```

## 📈 Performance

### **Otimizações Implementadas**
- ✅ Multi-stage build para reduzir tamanho da imagem
- ✅ Usuário não-root para segurança
- ✅ Health checks para monitoramento
- ✅ Volumes nomeados para persistência
- ✅ Network isolada para comunicação
- ✅ Restart policies para alta disponibilidade

### **Recursos Recomendados**
- **RAM**: Mínimo 2GB, recomendado 4GB
- **CPU**: Mínimo 2 cores
- **Disco**: Mínimo 10GB livres

## 🔄 CI/CD

### **Build para Produção**
```bash
# Build otimizado
docker-compose -f docker-compose.prod.yml up --build

# Push para registry
docker tag sue-backend:latest seu-registry/sue-backend:latest
docker push seu-registry/sue-backend:latest
```

---

**Desenvolvido para TCC UNIRIO - Sistema de Urna Eletrônica**
