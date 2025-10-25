# 🔧 Troubleshooting - Deploy no Render

## Erro: Cannot find module '/opt/render/project/src/backend/dist/main.js'

### Causa
Este erro ocorre quando o Render não consegue encontrar o arquivo compilado `main.js` no caminho esperado.

### Soluções Implementadas

#### 1. Arquivos de Configuração Criados/Atualizados

- ✅ **`nest-cli.json`** - Configuração do NestJS CLI
- ✅ **`tsconfig.json`** - Configuração do TypeScript com `rootDir: "./src"`
- ✅ **`tsconfig.build.json`** - Configuração específica para builds
- ✅ **`build.sh`** - Script de build com verificações
- ✅ **`build-tsc.sh`** - Script alternativo usando TypeScript diretamente
- ✅ **`package.json`** - Scripts atualizados e dependências corretas

#### 2. Dependências Corretas

**IMPORTANTE:** `@nestjs/cli` e `typescript` devem estar em `dependencies`, NÃO em `devDependencies`!

```json
"dependencies": {
  "@nestjs/cli": "^10.0.0",
  "typescript": "^5.0.0",
  ...
}
```

Isso garante que o Render possa compilar o código durante o deploy.

## Erro: ❌ Error: dist/main.js not found!

### Causa
O build do NestJS não está gerando o arquivo compilado corretamente.

### Solução 1: Verificar Dependências

Certifique-se que estas dependências estão em `dependencies`:
```json
{
  "dependencies": {
    "@nestjs/cli": "^10.0.0",
    "typescript": "^5.0.0",
    "@nestjs/common": "^10.4.20",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0"
  }
}
```

### Solução 2: Usar Build Alternativo

Se o `build.sh` falhar, use o `build-tsc.sh`:

**No Render Dashboard:**
- Build Command: `chmod +x build-tsc.sh && ./build-tsc.sh`

### Solução 3: Verificar Estrutura de Arquivos

A estrutura deve ser:
```
backend/
├── src/
│   ├── main.ts          ← Ponto de entrada
│   ├── app.module.ts
│   ├── prisma.service.ts  ← Serviço Prisma dentro de src/
│   ├── auth/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── models/
├── database/
│   └── prisma/
│       └── schema.prisma
├── dist/               ← Gerado pelo build
│   ├── main.js        ← Arquivo compilado
│   └── ...
├── package.json
├── tsconfig.json
├── nest-cli.json
└── build.sh
```

## Erro: File is not under 'rootDir'

### Causa
Arquivos TypeScript fora do `rootDir` configurado (geralmente `src/`) não podem ser importados.

### Erro Comum:
```
error TS6059: File '/opt/render/project/src/backend/database/src/prisma.service.ts' 
is not under 'rootDir' '/opt/render/project/src/backend/src'
```

### Solução:
O `prisma.service.ts` deve estar em `src/prisma.service.ts`, não em `database/src/`.

**Imports corretos:**
```typescript
// ✅ CORRETO
import { PrismaService } from '../prisma.service';
import { PrismaService } from './prisma.service';

// ❌ ERRADO
import { PrismaService } from '../../database/src/prisma.service';
```

**Estrutura corrigida:**
- `backend/src/prisma.service.ts` ← Arquivo do serviço
- `backend/database/prisma/schema.prisma` ← Schema Prisma

#### 2. Comando de Start Correto

**No render.yaml e no Dashboard do Render, use:**
```
startCommand: node dist/main.js
```

**NÃO use:**
```
startCommand: npm start
```

### Verificar no Render Dashboard

#### Durante o Build:
1. Acesse o log de build no Render Dashboard
2. Verifique se estas mensagens aparecem:
   ```
   📦 Installing dependencies...
   🔧 Generating Prisma Client...
   🏗️ Building NestJS application...
   ✅ Build completed successfully!
   ```

3. Verifique se o arquivo `dist/main.js` foi criado:
   ```
   ✅ Checking build output...
   ✅ Build completed successfully!
   ```

#### Durante o Start:
Se ainda houver erro, verifique:

1. **Root Directory está correto?**
   - Deve ser: `backend`
   
2. **Build Command está correto?**
   - Deve ser: `chmod +x build.sh && ./build.sh`
   
3. **Start Command está correto?**
   - Deve ser: `node dist/main.js`

### Verificação Local

Antes de fazer deploy, teste localmente:

```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
cd database
npx prisma generate
cd ..

# Build
npm run build

# Verificar se dist/main.js existe
ls -la dist/main.js

# Testar o start
node dist/main.js
```

### Estrutura de Diretórios Esperada no Render

Após o build, o Render deve ter:
```
/opt/render/project/src/
  └── backend/              ← Root Directory configurado
      ├── dist/
      │   └── main.js       ← Arquivo principal compilado
      ├── src/
      ├── database/
      ├── node_modules/
      ├── package.json
      ├── tsconfig.json
      ├── nest-cli.json
      └── build.sh
```

### Outros Erros Comuns

#### "Module not found" para dependências
```bash
# Certifique-se que todas as dependências estão em "dependencies", não em "devDependencies"
# Verifique package.json
```

#### "Prisma Client not generated"
```bash
# O build.sh já gera automaticamente
# Mas você pode forçar com: cd database && npx prisma generate
```

#### "Cannot find module '@nestjs/...'
```bash
# Verifique se todas as dependências @nestjs estão instaladas
npm install @nestjs/common @nestjs/core @nestjs/platform-express
```

### Checklist de Deploy

Antes de fazer deploy, confirme:

- [ ] `nest-cli.json` existe no diretório backend
- [ ] `tsconfig.json` tem `rootDir: "./src"`
- [ ] `package.json` tem script `build: "nest build"`
- [ ] `build.sh` tem permissão de execução
- [ ] Root Directory no Render está como `backend`
- [ ] Start Command está como `node dist/main.js`
- [ ] Todas as variáveis de ambiente estão configuradas

### Logs Úteis

Para debug, adicione ao início do `main.ts`:

```typescript
console.log('🚀 Starting application...');
console.log('📁 Current directory:', __dirname);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT || 3000);
```

### Contato

Se o problema persistir:
1. Verifique os logs completos no Render Dashboard
2. Copie a mensagem de erro completa
3. Verifique a seção de Environment Variables
