# 🔧 Correção Final: Login no Render

## 🎯 Problema Identificado

O script SQL `init-data.sql` **não estava sendo executado** no Render porque o caminho estava incorreto. O código procurava o arquivo em `dist/services/init-data.sql` mas ele está em `backend/database/init-data.sql`.

## ✅ Solução Implementada

Substituí a leitura do arquivo SQL por **criação direta via Prisma Client**, garantindo que os dados sejam inseridos corretamente.

### Dados Criados Automaticamente:

**Administrador:**
- Email: `admin@vota-ai.com`
- Senha: `admin123`

**Mesário:**
- Usuario: `mesario01`
- Senha: `mesario123`

## 🚀 Deploy no Render

### 1. Commit e Push
```bash
git add .
git commit -m "fix: criar dados iniciais via Prisma ao invés de SQL script"
git push origin fix_arq
```

### 2. Redeploy do Backend

O Render detectará o push automaticamente e fará o redeploy. Ou force manualmente:
1. Acesse o backend service no Render
2. **"Manual Deploy"** → **"Clear build cache & deploy"**

### 3. Configuração do Frontend

**Adicione a variável de ambiente no Frontend Service:**
```
VITE_API_URL=https://vota-ai-urna.onrender.com
```

**Build Command do Frontend:**
```bash
chmod +x build.sh && ./build.sh
```

### 4. Redeploy do Frontend
1. Acesse o frontend service no Render
2. **"Manual Deploy"** → **"Clear build cache & deploy"**

## 📋 Verificar Logs do Backend

Após o deploy, verifique os logs. Você deve ver:

```
🔄 Inicializando banco de dados...
📊 Executando migrações do Prisma...
✅ Tabelas encontradas: [ 'Administrador', 'Mesario', 'Eleicao' ]
📝 Executando dados iniciais...
📄 Criando dados iniciais via Prisma...
✅ Administrador criado: admin@vota-ai.com / admin123
✅ Mesário criado: mesario01 / mesario123
✅ Dados iniciais criados com sucesso!
✅ Banco de dados inicializado com sucesso!
```

## 🧪 Testar o Login

Acesse: `https://vota-ai-urna-frontend.onrender.com/login`

### Administrador:
- **Campo Usuário:** `admin@vota-ai.com`
- **Senha:** `admin123`

### Mesário:
- **Campo Usuário:** `mesario01`
- **Senha:** `mesario123`

## 🔍 Como Funciona a Autenticação

O `auth.service.ts` valida de forma unificada:

1. **Tenta validar como Admin** usando o campo `email`:
   ```typescript
   const admin = await this.adminRepository.findByEmail(usuario);
   ```

2. **Se não encontrar, tenta como Mesário** usando o campo `usuario`:
   ```typescript
   const mesario = await this.mesarioRepository.findByUsuario(usuario);
   ```

Por isso:
- ✅ Admin: use **email** → `admin@vota-ai.com`
- ✅ Mesário: use **usuario** → `mesario01`

## 🚨 Troubleshooting

### Se ainda der erro 401:

1. **Verifique os logs do backend** - confirme que os dados foram criados
2. **Verifique se está usando o email correto** - `admin@vota-ai.com` (não `admin`)
3. **Limpe o cache do banco** - force um redeploy com "Clear build cache"

### Para verificar se os dados existem:

Adicione este log temporário em `auth.service.ts` no método `validateUser`:

```typescript
console.log('🔍 Tentando validar:', { usuario, senha });
const admin = await this.adminRepository.findByEmail(usuario);
console.log('👤 Admin encontrado:', admin ? 'SIM' : 'NÃO');
```

## ✅ Checklist Final

- [ ] Código atualizado com criação via Prisma
- [ ] Commit e push realizados
- [ ] Backend redesployado no Render
- [ ] Logs mostram "Dados iniciais criados com sucesso"
- [ ] Variável `VITE_API_URL` configurada no frontend
- [ ] Frontend redesployado no Render
- [ ] Login testado com `admin@vota-ai.com` / `admin123`
- [ ] Login testado com `mesario01` / `mesario123`

---

**💡 Importante:** Use `admin@vota-ai.com` no campo usuário do login, não apenas `admin`!
