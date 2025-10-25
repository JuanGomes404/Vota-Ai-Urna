# Guia de Deploy do Frontend no Render

## Pré-requisitos
✅ Backend já deployado no Render
✅ URL do backend disponível (ex: `https://vota-ai-backend.onrender.com`)

## Opção 1: Deploy como Static Site (Recomendado)

### Passo 1: Preparar o Repositório
1. Faça commit de todos os arquivos atualizados:
   ```bash
   git add .
   git commit -m "Configure frontend for Render deployment"
   git push origin dev_frontend
   ```

### Passo 2: Criar Static Site no Render
1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Static Site"**
3. Conecte seu repositório GitHub `JuanGomes404/Vota-Ai-Urna`
4. Configure o serviço:

   **Basic Settings:**
   - **Name:** `vota-ai-frontend`
   - **Region:** `Oregon (US West)`
   - **Branch:** `dev_frontend` (ou sua branch principal)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

   **Environment Variables:**
   Adicione as seguintes variáveis:
   ```
   VITE_API_URL=https://vota-ai-backend.onrender.com
   ```
   
   ⚠️ **IMPORTANTE:** Substitua a URL acima pela URL real do seu backend no Render!

5. Clique em **"Create Static Site"**

### Passo 3: Verificar o Deploy
Após o deploy, acesse:
- Frontend: `https://vota-ai-frontend.onrender.com`
- Teste fazer login e verificar se está conectando com o backend

## Opção 2: Deploy como Web Service (Alternativa)

Se preferir servir o frontend com um servidor Node.js:

### Adicionar ao package.json:
```json
"scripts": {
  "start": "npm run preview",
  "preview": "vite preview --host 0.0.0.0 --port $PORT"
}
```

### Configurar como Web Service:
- **Type:** Web Service
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run preview`

## Configurações Importantes

### 1. Atualizar CORS no Backend

Após obter a URL do frontend, atualize o backend `main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://vota-ai-frontend.onrender.com',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true,
});
```

**Não esqueça de fazer o redeploy do backend após essa alteração!**

### 2. Testar a Conexão

Abra o console do navegador (F12) e verifique:
- ✅ Sem erros de CORS
- ✅ Requisições à API funcionando
- ✅ Login funcionando corretamente

### 3. Configuração de Rotas SPA

O arquivo `public/_redirects` garante que o Vue Router funcione corretamente:
```
/*    /index.html   200
```

Isso redireciona todas as rotas para `index.html`, permitindo que o Vue Router gerencie a navegação.

## Estrutura de URLs Após Deploy

- **Frontend:** `https://vota-ai-frontend.onrender.com`
- **Backend:** `https://vota-ai-backend.onrender.com`
- **API Calls:** O frontend fará requisições para `https://vota-ai-backend.onrender.com/*`

## Fluxo de Dados

```
Usuario → Frontend (Render Static Site)
            ↓
         API Call
            ↓
       Backend (Render Web Service)
            ↓
       PostgreSQL Database (Render)
```

## Solução de Problemas

### Build falha
- Verifique os logs no dashboard do Render
- Certifique-se de que todas as dependências estão no `package.json`
- Teste o build localmente: `npm run build`

### Erro de CORS
- Verifique se a URL do frontend está configurada no backend
- Verifique se `VITE_API_URL` está correta
- Faça redeploy do backend após alterar CORS

### Página em branco
- Verifique se o `Publish Directory` está como `dist`
- Verifique se o arquivo `_redirects` está sendo copiado
- Verifique o console do navegador para erros

### API não conecta
- Verifique se `VITE_API_URL` está configurada corretamente
- Teste a URL do backend diretamente: `https://vota-ai-backend.onrender.com/health`
- Verifique se o backend está rodando

## Variáveis de Ambiente

### Desenvolvimento (local)
Crie um arquivo `.env` no diretório `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

### Produção (Render)
Configure no dashboard do Render:
```
VITE_API_URL=https://vota-ai-backend.onrender.com
```

## Atualizações Automáticas

O Render fará redeploy automático quando você:
- Fizer push para a branch configurada
- Alterar variáveis de ambiente
- Fazer redeploy manual no dashboard

## Checklist Final

Antes de considerar o deploy completo:

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e carregando
- [ ] CORS configurado no backend com a URL do frontend
- [ ] Variável `VITE_API_URL` configurada no frontend
- [ ] Login funcionando
- [ ] Navegação entre páginas funcionando (Vue Router)
- [ ] Chamadas de API funcionando
- [ ] Console sem erros críticos

## Próximos Passos

Após deploy bem-sucedido:
1. ✅ Configure um domínio customizado (opcional)
2. ✅ Configure SSL/HTTPS (Render faz automaticamente)
3. ✅ Configure monitoramento e logs
4. ✅ Teste todas as funcionalidades do sistema
5. ✅ Configure backups do banco de dados

## Links Úteis

- **Render Dashboard:** https://dashboard.render.com
- **Documentação Render Static Sites:** https://render.com/docs/static-sites
- **Documentação Vite Build:** https://vitejs.dev/guide/build.html
- **Documentação Vue Router:** https://router.vuejs.org/

## Notas de Segurança

⚠️ **IMPORTANTE:**
- Nunca commite arquivos `.env` com dados sensíveis
- Use variáveis de ambiente do Render para configurações
- Configure HTTPS (Render faz automaticamente)
- Configure headers de segurança (CSP, X-Frame-Options, etc.)
- Valide todas as entradas do usuário no backend
