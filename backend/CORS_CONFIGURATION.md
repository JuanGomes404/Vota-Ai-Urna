# 🌐 Configuração CORS - Correção Aplicada

## ❌ Problema Identificado

O erro `Network Error` ocorreu porque o backend **não estava configurado para aceitar requisições** do frontend hospedado no Render.

### Erro Original:
```
AxiosError: Network Error
code: "ERR_NETWORK"
message: "Network Error"
```

Este erro acontecia porque:
1. O backend NÃO tinha configuração CORS
2. O navegador bloqueava requisições do frontend (`https://vota-ai-urna-frontend.onrender.com`) para o backend (`https://vota-ai-urna.onrender.com`)
3. Requisições como `POST /auth/logout` falhavam antes mesmo de chegar ao backend

## ✅ Solução Implementada

### 1. Configuração CORS Adicionada no `main.ts`

```typescript
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CONFIGURAÇÃO CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Frontend local (Vite)
      'http://localhost:3000',  // Frontend local alternativo
      'https://vota-ai-urna-frontend.onrender.com',  // Frontend em produção
      'https://vota-ai-urna.onrender.com',  // Backend em produção
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Backend iniciado na porta ${port}`);
  console.log(`🌐 CORS habilitado para frontend em produção`);
}
bootstrap();
```

### 2. O que esta configuração faz:

- **`origin`**: Lista de URLs permitidas para fazer requisições ao backend
  - Inclui frontend local para desenvolvimento
  - Inclui frontend em produção no Render
  
- **`methods`**: Métodos HTTP permitidos
  - GET, POST, PUT, DELETE, PATCH, OPTIONS
  
- **`allowedHeaders`**: Headers permitidos nas requisições
  - Content-Type (para JSON)
  - Authorization (para tokens JWT)
  - Accept
  
- **`credentials: true`**: Permite envio de cookies e headers de autenticação
  
- **`optionsSuccessStatus: 204`**: Resposta para requisições OPTIONS (preflight)

## 🔄 Como Aplicar a Correção

### Opção 1: Deploy Automático (Se conectado ao GitHub)
```bash
git add backend/src/main.ts
git commit -m "fix: Adicionar configuração CORS para produção"
git push origin main
```

O Render detectará o push e fará o deploy automático.

### Opção 2: Deploy Manual no Render
1. Acesse o [Render Dashboard](https://dashboard.render.com/)
2. Selecione o serviço backend
3. Clique em "Manual Deploy" → "Deploy latest commit"

### Opção 3: Teste Local
```bash
cd backend
npm run build
npm start
```

Acesse `http://localhost:3000/health` e verifique se o backend está rodando.

## ✅ Como Verificar se Está Funcionando

### 1. Teste direto com curl:
```bash
# Teste sem CORS (direto do terminal)
curl -X POST https://vota-ai-urna.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin@vota-ai.com","senha":"admin123"}'
```

### 2. Teste no navegador (Console do DevTools):
```javascript
// Abra o console do navegador (F12) no frontend
fetch('https://vota-ai-urna.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### 3. Teste o login completo:
```javascript
fetch('https://vota-ai-urna.onrender.com/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usuario: 'admin@vota-ai.com',
    senha: 'admin123'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## 🎯 Resultado Esperado

### ✅ Antes (com erro):
```
❌ Network Error
❌ Requisições bloqueadas pelo navegador
❌ CORS policy error
```

### ✅ Depois (funcionando):
```
✅ Status 200 OK
✅ Requisições chegam ao backend
✅ Login funciona corretamente
✅ Logout funciona corretamente
```

## 📝 Logs do Backend

Após o deploy, você verá no console do Render:
```
🚀 Backend iniciado na porta 3000
🌐 CORS habilitado para frontend em produção
```

## 🔐 Considerações de Segurança

Esta configuração CORS:
- ✅ **Segura**: Apenas origens específicas são permitidas
- ✅ **Flexível**: Funciona em desenvolvimento e produção
- ✅ **Completa**: Suporta autenticação com JWT
- ✅ **Correta**: Segue as melhores práticas do NestJS

## 🚨 Problemas Adicionais?

Se ainda houver problemas, verifique:

### 1. URL do Backend no Frontend
Verifique se o frontend está usando a URL correta:
```typescript
// frontend - deve apontar para o backend correto
const API_URL = 'https://vota-ai-urna.onrender.com'
```

### 2. Variáveis de Ambiente do Frontend
```bash
# .env no frontend
VITE_API_URL=https://vota-ai-urna.onrender.com
```

### 3. Timeout no Render
O Render pode levar alguns minutos para fazer o deploy. Aguarde a mensagem:
```
==> Your service is live 🎉
```

### 4. Verificar Headers na Rede
No DevTools → Network → Selecione a requisição → Headers:
- Deve ter `Access-Control-Allow-Origin: <frontend-url>`
- Deve ter `Access-Control-Allow-Methods: GET, POST, ...`

## 📚 Documentação de Referência

- [NestJS CORS Documentation](https://docs.nestjs.com/security/cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Render Deploy Documentation](https://render.com/docs/deploy-node-express-app)

---

**✅ Correção aplicada com sucesso!**

Após o deploy, o erro de CORS estará resolvido e o frontend poderá se comunicar com o backend sem problemas.
