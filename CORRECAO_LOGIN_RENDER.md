# 🔧 Guia de Correção: Login não Funciona no Render

## 🎯 Problema Identificado

O frontend não consegue se comunicar com o backend porque a variável `VITE_API_URL` não está sendo injetada durante o **build** do projeto. 

Quando o Vite faz o build sem essa variável, ele usa o fallback `/api`, fazendo com que o frontend tente acessar:
```
https://vota-ai-frontend.onrender.com/api/auth/login  ❌ (não existe)
```

Ao invés de:
```
https://vota-ai-backend.onrender.com/auth/login  ✅ (correto)
```

## ✅ Solução: Configurar no Render Dashboard

### 📱 Passo 1: Acessar o Frontend no Render

1. Acesse https://dashboard.render.com
2. Selecione o serviço do **Frontend** (vota-ai-frontend)
3. Vá em **"Environment"** no menu lateral

### 📝 Passo 2: Adicionar Variável de Ambiente

Clique em **"Add Environment Variable"** e adicione:

```
Key: VITE_API_URL
Value: https://vota-ai-urna.onrender.com
```

**⚠️ IMPORTANTE:** 
- Não adicione barra `/` no final da URL
- Verifique se a URL do backend está correta
- A variável deve estar disponível **durante o build**, não apenas em runtime

### 🔄 Passo 3: Atualizar Build Command

No Render Dashboard, vá em **"Settings"** → **"Build & Deploy"**

Atualize o **Build Command** para:

```bash
chmod +x build.sh && ./build.sh
```

Ou, se preferir inline:

```bash
export VITE_API_URL=https://vota-ai-urna.onrender.com && npm install && npm run build
```

### 🚀 Passo 4: Fazer Redeploy

1. Vá em **"Manual Deploy"** → **"Clear build cache & deploy"**
2. Aguarde o build completar
3. Verifique os logs durante o build

### 📊 Passo 5: Verificar Logs

Durante o build, você deve ver:

```
🚀 Iniciando build do frontend Vue.js...
📍 VITE_API_URL: https://vota-ai-urna.onrender.com
✅ Usando VITE_API_URL: https://vota-ai-urna.onrender.com
📦 Instalando dependências...
🔨 Fazendo build da aplicação...
```

## 🔍 Como Testar

### 1. Abra o Console do Navegador (F12)

Ao acessar a página de login, você deve ver:

```
🔧 Environment Check:
  - MODE: production
  - DEV: false
  - PROD: true
  - VITE_API_URL: https://vota-ai-urna.onrender.com
✅ Usando VITE_API_URL: https://vota-ai-urna.onrender.com
🌐 API configurada com baseURL: https://vota-ai-urna.onrender.com
```

### 2. Tente Fazer Login

Você deve ver no console:

```
🔐 Iniciando login...
👤 Usuário: admin
📤 POST https://vota-ai-urna.onrender.com/auth/login
✅ POST /auth/login - Status: 200
✅ Login bem-sucedido!
👤 User data: { id: '...', nome: '...', role: 'admin' }
🎭 Role: admin
🔑 Token recebido: SIM
➡️ Redirecionando para /admin
```

## 🚨 Troubleshooting

### Erro: "Cannot read properties of undefined"

**Problema:** VITE_API_URL não foi injetada no build

**Solução:**
1. Verifique se adicionou a variável no Render Dashboard
2. Faça um **"Clear build cache & deploy"**
3. Certifique-se que o build.sh está sendo executado

### Erro: "Network Error" ou "ERR_CONNECTION_REFUSED"

**Problema:** Backend não está respondendo

**Solução:**
1. Verifique se o backend está rodando (https://vota-ai-urna.onrender.com/health)
2. Verifique se a URL do backend está correta
3. Verifique CORS no backend (deve permitir o domínio do frontend)

### Erro: "404 Not Found" no /api/auth/login

**Problema:** O build ainda está usando `/api` ao invés da URL completa

**Solução:**
1. A variável VITE_API_URL não foi injetada corretamente
2. Faça um **"Clear build cache & deploy"** no Render
3. Verifique se a variável está no Environment durante o build

### Login redireciona para "Not Found"

**Problema:** Rotas do Vue Router não estão configuradas corretamente

**Solução:**
1. Verifique se o arquivo `_redirects` existe em `public/`
2. No Render, as rotas SPA devem estar configuradas para redirecionar para `index.html`

## 📄 Configuração do Render (Checklist)

### Frontend Service:
- ✅ **Environment:** Static Site
- ✅ **Build Command:** `chmod +x build.sh && ./build.sh`
- ✅ **Publish Directory:** `./dist`
- ✅ **Environment Variables:**
  - `VITE_API_URL=https://vota-ai-urna.onrender.com`

### Backend Service:
- ✅ **Environment:** Node
- ✅ **Build Command:** `chmod +x build.sh && ./build.sh`
- ✅ **Start Command:** `chmod +x start.sh && ./start.sh`
- ✅ **Environment Variables:**
  - `DATABASE_URL` (PostgreSQL connection string)
  - `NODE_ENV=production`
  - `PORT=10000`
  - `SECRET` (JWT secret)
  - `FRONTEND_URL=https://vota-ai-frontend.onrender.com`

## 🔐 Verificar CORS no Backend

O `main.ts` do backend deve permitir o domínio do frontend:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://vota-ai-frontend.onrender.com',  // ✅ Deve estar aqui
  ],
  // ... outras configurações
});
```

## 🎯 Resumo da Solução

1. ✅ Adicionar `VITE_API_URL` nas variáveis de ambiente do Render
2. ✅ Atualizar Build Command para usar `build.sh`
3. ✅ Fazer "Clear build cache & deploy"
4. ✅ Testar login e verificar console do navegador
5. ✅ Verificar se backend permite CORS do frontend

---

**💡 Dica:** Sempre verifique os logs do console do navegador (F12) ao fazer login. Eles mostrarão exatamente qual URL está sendo chamada e se há erros de CORS ou conexão.

**🔥 Importante:** A variável `VITE_API_URL` é injetada no código JavaScript **durante o build**, não em runtime! Por isso é crucial que ela esteja definida no momento do build.
