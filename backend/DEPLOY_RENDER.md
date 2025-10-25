# Guia de Deploy do Backend no Render

## Pré-requisitos
✅ Banco de dados PostgreSQL já configurado no Render
✅ Credenciais do banco disponíveis no `.env`

## Opção 1: Deploy via Dashboard do Render (Recomendado)

### Passo 1: Preparar o Repositório
1. Faça commit de todos os arquivos atualizados:
   ```bash
   git add .
   git commit -m "Configure backend for Render deployment"
   git push origin dev_frontend
   ```

### Passo 2: Criar Web Service no Render
1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub `JuanGomes404/Vota-Ai-Urna`
4. Configure o serviço:

   **Basic Settings:**
   - **Name:** `vota-ai-backend`
   - **Region:** `Oregon (US West)`
   - **Branch:** `dev_frontend` (ou sua branch principal)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `chmod +x build.sh && ./build.sh`
   - **Start Command:** `npm start`

   **Advanced Settings - Environment Variables:**
   Adicione as seguintes variáveis:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://SEU_USER:SUA_PASSWORD@SEU_HOST.render.com:5432/SEU_DATABASE?schema=public
   SECRET=<gerar um token secreto forte>
   FRONTEND_URL=https://vota-ai-frontend.onrender.com
   ```
   
   ⚠️ **IMPORTANTE:** Substitua `DATABASE_URL` com as credenciais reais do seu banco PostgreSQL no Render!

   **Para gerar o SECRET:**
   Execute no terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. Clique em **"Create Web Service"**

### Passo 3: Configurar Migrações do Prisma (Após primeiro deploy)
1. No dashboard do seu Web Service, vá em **"Shell"**
2. Execute:
   ```bash
   cd database
   npx prisma migrate deploy
   ```

### Passo 4: Verificar o Deploy
Após o deploy, acesse:
- Health Check: `https://vota-ai-backend.onrender.com/health`
- Deve retornar:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-10-24T...",
    "service": "Sistema de Votação Eletrônica - TCC UNIRIO"
  }
  ```

## Opção 2: Deploy via Blueprint (render.yaml)

Se preferir usar o arquivo `render.yaml`:

1. No Render Dashboard, clique em **"New +"** → **"Blueprint"**
2. Conecte seu repositório
3. O Render detectará automaticamente o `render.yaml`
4. **IMPORTANTE:** Antes de criar, edite as variáveis de ambiente para adicionar um SECRET forte
5. Clique em **"Apply"**

## Configurações Importantes

### CORS
Certifique-se de que o backend aceita requisições do frontend. Verifique o arquivo `main.ts`:
```typescript
app.enableCors({
  origin: ['https://seu-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true
});
```

### Health Check
O Render verificará automaticamente a rota `/health` para garantir que o serviço está funcionando.

## Solução de Problemas

### Build falha
- Verifique os logs no dashboard do Render
- Certifique-se de que todas as dependências estão no `package.json`

### Erro de conexão com banco de dados
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o schema Prisma está sincronizado: `npx prisma migrate deploy`

### Aplicação não inicia
- Verifique se o comando start está correto: `npm start`
- Verifique se a porta está configurada corretamente (Render usa PORT=10000)

## Próximos Passos

Após o deploy do backend:
1. ✅ Anote a URL do backend: `https://vota-ai-backend.onrender.com`
2. Configure o frontend para usar essa URL
3. Configure CORS no backend para aceitar requisições do frontend
4. Configure as variáveis de ambiente do frontend com a URL do backend

## Estrutura de URLs

Após o deploy, suas rotas serão:
- **Health:** `https://vota-ai-backend.onrender.com/health`
- **Auth:** `https://vota-ai-backend.onrender.com/auth/login`
- **Admin:** `https://vota-ai-backend.onrender.com/admin/*`
- **Mesário:** `https://vota-ai-backend.onrender.com/mesario/*`
- **Urna:** `https://vota-ai-backend.onrender.com/urna/*`

## Notas de Segurança

⚠️ **IMPORTANTE:** 
- Nunca commite arquivos `.env` com credenciais reais
- Use variáveis de ambiente do Render para dados sensíveis
- Gere um SECRET forte e único para produção
- Configure HTTPS (Render faz isso automaticamente)
