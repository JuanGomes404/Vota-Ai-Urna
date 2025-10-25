# 🚀 Deploy Rápido - Correção CORS

## ✅ Correção Aplicada

A configuração CORS foi adicionada ao `backend/src/main.ts` para permitir requisições do frontend hospedado no Render.

## 📦 Como Fazer o Deploy

### Opção 1: Via Git (Recomendado)

```bash
# 1. Adicionar arquivos modificados
git add backend/src/main.ts
git add backend/CORS_CONFIGURATION.md
git add backend/DEPLOY_GUIDE.md

# 2. Fazer commit
git commit -m "fix: Adicionar configuração CORS para produção - Resolver erro de Network"

# 3. Fazer push
git push origin fix_arq
```

**O Render detectará automaticamente o push e iniciará o deploy.**

### Opção 2: Deploy Manual no Render

1. Acesse: https://dashboard.render.com/
2. Selecione o serviço: **vota-ai-urna** (backend)
3. Clique em: **"Manual Deploy"** → **"Deploy latest commit"**
4. Aguarde o build (2-5 minutos)

## ⏱️ Tempo de Deploy

- **Build**: ~2-3 minutos
- **Deploy**: ~1-2 minutos
- **Total**: ~3-5 minutos

## ✅ Como Verificar se Funcionou

### 1. Verifique os Logs do Render

Procure por estas mensagens no log:
```
🚀 Backend iniciado na porta 3000
🌐 CORS habilitado para frontend em produção
==> Your service is live 🎉
```

### 2. Teste o Health Check

```bash
curl https://vota-ai-urna.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T...",
  "service": "Sistema de Votação Eletrônica - TCC UNIRIO"
}
```

### 3. Teste o Login no Frontend

1. Acesse: https://vota-ai-urna-frontend.onrender.com
2. Faça login com:
   - **Usuário**: `admin@vota-ai.com`
   - **Senha**: `admin123`
3. O login deve funcionar sem erro de "Network Error"

### 4. Verifique no Console do Navegador

Abra o DevTools (F12) e veja se NÃO há mais erros como:
```
❌ AxiosError: Network Error
❌ Access-Control-Allow-Origin
❌ CORS policy
```

## 🎯 Resultado Esperado

### ✅ Antes (com erro):
```
index-f4a55932.js:34  Erro no logout: gt
logout @ index-f4a55932.js:34
AxiosError: Network Error
code: "ERR_NETWORK"
```

### ✅ Depois (funcionando):
```
✅ Login bem-sucedido
✅ Logout funciona
✅ Requisições são aceitas pelo backend
✅ Headers CORS corretos
```

## 🔍 Troubleshooting

### Problema: "Still getting Network Error"

**Solução 1**: Aguarde 5 minutos após o deploy
- O Render pode levar alguns minutos para propagar as mudanças

**Solução 2**: Limpe o cache do navegador
```
Ctrl + Shift + Delete → Limpar cache e cookies
```

**Solução 3**: Force reload no frontend
```
Ctrl + Shift + R (hard refresh)
```

**Solução 4**: Verifique se o backend está rodando
```bash
curl https://vota-ai-urna.onrender.com/health
```

### Problema: "Backend não está acessível"

1. Verifique se o serviço está ativo no Render Dashboard
2. Verifique os logs por erros de build
3. Certifique-se que a porta está configurada corretamente (PORT=3000)

### Problema: "Frontend ainda não conecta"

Verifique se o frontend está usando a URL correta:
```typescript
// Deve ser:
const API_URL = 'https://vota-ai-urna.onrender.com'

// NÃO deve ser:
const API_URL = 'http://localhost:3000'
```

## 📋 Checklist Pós-Deploy

- [ ] Backend buildou sem erros
- [ ] Logs mostram "CORS habilitado"
- [ ] Health check responde OK
- [ ] Frontend carrega sem erros
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Sem erros de CORS no console

## 🎉 Sucesso!

Se todos os passos acima funcionaram, o erro de CORS está **corrigido**!

O sistema agora permite:
- ✅ Requisições do frontend para o backend
- ✅ Autenticação com JWT
- ✅ Login e logout funcionais
- ✅ Comunicação segura entre os serviços

---

**Dúvidas?** Consulte o arquivo `CORS_CONFIGURATION.md` para mais detalhes.
