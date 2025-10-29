# 🚀 Instruções Rápidas - Configuração do Render

## 📋 Resumo

**Backend URL:** `https://vota-ai-urna.onrender.com`  
**Frontend URL:** `https://vota-ai-urna-frontend.onrender.com`

---

## ⚙️ Configuração no Render Dashboard

### 1️⃣ Frontend Service

Acesse: https://dashboard.render.com → Selecione o serviço do Frontend

#### Environment Variables:
```
VITE_API_URL=https://vota-ai-urna.onrender.com
```

#### Build Command:
```bash
chmod +x build.sh && ./build.sh
```

#### Publish Directory:
```
./dist
```

### 2️⃣ Fazer Redeploy

1. Vá em **"Manual Deploy"**
2. Selecione **"Clear build cache & deploy"**
3. Aguarde o build completar

---

## 🧪 Testar o Login

1. Acesse: `https://vota-ai-urna-frontend.onrender.com/login`
2. Abra o Console do navegador (F12)
3. Tente fazer login com:
   - **Usuário:** `admin`
   - **Senha:** `admin123`

### ✅ Logs Esperados no Console:

```
🔧 Environment Check:
  - MODE: production
  - VITE_API_URL: https://vota-ai-urna.onrender.com
✅ Usando VITE_API_URL: https://vota-ai-urna.onrender.com
🌐 API configurada com baseURL: https://vota-ai-urna.onrender.com

🔐 Iniciando login...
📤 POST https://vota-ai-urna.onrender.com/auth/login
✅ POST /auth/login - Status: 200
✅ Login bem-sucedido!
🎭 Role: admin
➡️ Redirecionando para /admin
```

---

## 🔍 Verificações de Saúde

### Backend:
```
https://vota-ai-urna.onrender.com/health
```
**Resposta esperada:** Status 200 OK

### Frontend:
```
https://vota-ai-urna-frontend.onrender.com
```
**Resposta esperada:** Página inicial carrega

---

## ✅ CORS já está configurado!

O backend (`main.ts`) já permite requisições do frontend:

```typescript
origin: [
  'https://vota-ai-urna-frontend.onrender.com',  // ✅ Frontend em produção
  // ... outras URLs
]
```

---

## 🚨 Se o erro persistir:

1. **Verifique no console se a URL está correta:**
   - Deve mostrar `https://vota-ai-urna.onrender.com`
   - Se mostrar `/api/auth/login`, o build não pegou a variável

2. **Force um rebuild completo:**
   - "Clear build cache & deploy"

3. **Verifique se o backend está rodando:**
   - Acesse `/health` endpoint

4. **Verifique se há erros de CORS:**
   - No console deve aparecer mensagem específica se for CORS

---

## 📝 Credenciais Padrão

### Administrador:
- **Usuário:** `admin`
- **Senha:** `admin123`

### Mesário:
- **Usuário:** `mesario1`
- **Senha:** `mesario123`

---

**💡 Dica:** Sempre verifique o console do navegador (F12) - os logs mostram exatamente o que está acontecendo!
