# Deploy Guide - Sistema de Votação Eletrônica Vota Ai

## 📋 Visão Geral

Este guia consolida os passos para fazer o deploy completo do sistema no Render.

### Arquitetura do Deploy

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER CLOUD                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐    ┌─────────────────┐           │
│  │  Static Site     │───▶│  Web Service    │           │
│  │  (Frontend)      │    │  (Backend)      │           │
│  │  Vue.js + Vite   │    │  NestJS         │           │
│  └──────────────────┘    └────────┬────────┘           │
│                                    │                     │
│                                    ▼                     │
│                          ┌─────────────────┐            │
│                          │  PostgreSQL DB  │            │
│                          │  (Managed)      │            │
│                          └─────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Ordem de Deploy

### 1️⃣ Deploy do Banco de Dados
✅ **Crie um PostgreSQL Database no Render**
- Acesse: https://dashboard.render.com
- New + → PostgreSQL
- Anote as credenciais (Host, Port, Database, User, Password)
- ⚠️ **IMPORTANTE:** Nunca exponha estas credenciais publicamente!

### 2️⃣ Deploy do Backend

📁 **Localização:** `backend/`
📖 **Guia Detalhado:** `backend/DEPLOY_RENDER.md`

**Resumo dos passos:**
1. Push do código para GitHub
2. Criar Web Service no Render
3. Configurar variáveis de ambiente:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
   SECRET=<gerar token forte com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
   FRONTEND_URL=https://vota-ai-frontend.onrender.com
   ```
   
   ⚠️ **NUNCA commite credenciais reais! Configure-as diretamente no Render Dashboard.**
4. Deploy automático
5. Executar migrações Prisma: `npx prisma migrate deploy`

**URL esperada:** `https://vota-ai-backend.onrender.com`

### 3️⃣ Deploy do Frontend

📁 **Localização:** `frontend/`
📖 **Guia Detalhado:** `frontend/DEPLOY_RENDER.md`

**Resumo dos passos:**
1. Criar Static Site no Render
2. Configurar:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
3. Configurar variável de ambiente:
   ```
   VITE_API_URL=https://vota-ai-backend.onrender.com
   ```
4. Deploy automático

**URL esperada:** `https://vota-ai-frontend.onrender.com`

### 4️⃣ Atualizar CORS no Backend

Após obter a URL do frontend, adicione no `backend/src/main.ts`:
```typescript
origin: [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://vota-ai-frontend.onrender.com'  // URL real do frontend
]
```

Faça redeploy do backend!

## 📝 Checklist Completo

### Pré-Deploy
- [ ] Código commitado no GitHub
- [ ] Branch `dev_frontend` atualizada
- [ ] Banco de dados PostgreSQL criado no Render
- [ ] Credenciais do banco anotadas

### Deploy Backend
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Health check respondendo: `/health`
- [ ] Migrações Prisma executadas
- [ ] URL do backend anotada

### Deploy Frontend
- [ ] Static Site criado no Render
- [ ] Variável `VITE_API_URL` configurada
- [ ] Build executado com sucesso
- [ ] Frontend carregando corretamente
- [ ] URL do frontend anotada

### Integração
- [ ] CORS atualizado no backend com URL do frontend
- [ ] Backend redployado
- [ ] Login funcionando
- [ ] API calls funcionando
- [ ] Console sem erros de CORS

### Testes
- [ ] Módulo Admin funcionando
- [ ] Módulo Mesário funcionando
- [ ] Módulo Urna funcionando
- [ ] Criação de eleição
- [ ] Upload de eleitores
- [ ] Autorização de voto
- [ ] Votação anônima
- [ ] Visualização de resultados

## 🔧 Comandos Úteis

### Gerar SECRET para JWT
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Testar Backend Localmente
```bash
cd backend
npm install
npm run start:dev
```

### Testar Frontend Localmente
```bash
cd frontend
npm install
npm run dev
```

### Build Local do Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 URLs do Sistema

Após deploy completo:

| Componente | URL |
|------------|-----|
| Frontend | `https://vota-ai-frontend.onrender.com` |
| Backend | `https://vota-ai-backend.onrender.com` |
| Health Check | `https://vota-ai-backend.onrender.com/health` |
| Database | `dpg-d3u148ndiees73dtis30-a.oregon-postgres.render.com:5432` |

## 🆘 Troubleshooting

### Backend não inicia
1. Verifique os logs no Render Dashboard
2. Verifique se `DATABASE_URL` está correta
3. Execute migrações: `npx prisma migrate deploy`
4. Verifique se todas as dependências foram instaladas

### Frontend não carrega
1. Verifique se `dist/` foi gerado corretamente
2. Verifique se `Publish Directory` está como `dist`
3. Verifique se `_redirects` está em `public/`

### Erro de CORS
1. Verifique se a URL do frontend está no array `origin` do backend
2. Verifique se `credentials: true` está configurado
3. Faça redeploy do backend após alteração

### API não conecta
1. Verifique se `VITE_API_URL` está configurada no frontend
2. Teste o health check do backend
3. Verifique o console do navegador

## 📚 Recursos Adicionais

- [Documentação Render](https://render.com/docs)
- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Vue.js](https://vuejs.org)
- [Documentação Vite](https://vitejs.dev)
- [Documentação Prisma](https://www.prisma.io/docs)

## 🔒 Segurança

- ✅ HTTPS habilitado automaticamente pelo Render
- ✅ Variáveis sensíveis em environment variables
- ✅ CORS configurado adequadamente
- ✅ JWT para autenticação
- ✅ Votação anônima garantida pela arquitetura

## 📞 Suporte

Em caso de problemas:
1. Consulte os guias detalhados em `backend/DEPLOY_RENDER.md` e `frontend/DEPLOY_RENDER.md`
2. Verifique os logs no Render Dashboard
3. Verifique o console do navegador
4. Consulte a documentação oficial do Render

---

**Sistema de Votação Eletrônica - TCC UNIRIO**
Desenvolvido com ❤️ usando NestJS, Vue.js e PostgreSQL
