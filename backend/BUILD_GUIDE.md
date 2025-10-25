# Backend Build Guide

## 🔨 Scripts de Build Disponíveis

### 1. build.sh (Recomendado)
Build usando NestJS CLI:
```bash
chmod +x build.sh
./build.sh
```

### 2. build-tsc.sh (Alternativo)
Build usando TypeScript Compiler diretamente:
```bash
chmod +x build-tsc.sh
./build-tsc.sh
```

## 📋 Requisitos

### Dependências Necessárias em `dependencies`:
- `@nestjs/cli` - Para build com NestJS
- `typescript` - Para compilação TypeScript
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` - Core do NestJS
- `@prisma/client`, `prisma` - ORM

### Arquivos de Configuração:
- `nest-cli.json` - Configuração do NestJS CLI
- `tsconfig.json` - Configuração do TypeScript
- `tsconfig.build.json` - Configuração de build
- `package.json` - Scripts e dependências

## 🚀 Como Funciona o Build

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Gerar Prisma Client
```bash
cd database
npx prisma generate
cd ..
```

### Passo 3: Compilar TypeScript
```bash
npx nest build
# OU
npx tsc -p tsconfig.build.json
```

### Passo 4: Verificar Output
```bash
ls -la dist/main.js
```

## 📁 Estrutura Esperada Após Build

```
backend/
├── dist/                    ← Diretório gerado
│   ├── main.js             ← Ponto de entrada compilado
│   ├── app.module.js
│   ├── controllers/
│   ├── services/
│   └── ...
├── src/                     ← Código fonte
│   ├── main.ts
│   └── ...
└── node_modules/
```

## 🔧 Configuração no Render

### Opção 1: NestJS CLI (build.sh)
```yaml
buildCommand: chmod +x build.sh && ./build.sh
startCommand: node dist/main.js
```

### Opção 2: TypeScript Compiler (build-tsc.sh)
```yaml
buildCommand: chmod +x build-tsc.sh && ./build-tsc.sh
startCommand: node dist/main.js
```

## ⚠️ Problemas Comuns

### "nest: command not found"
**Causa:** `@nestjs/cli` está em `devDependencies`
**Solução:** Mova para `dependencies`

### "dist/main.js not found"
**Causa:** Build falhou silenciosamente
**Solução:** 
1. Verifique logs do build
2. Use `build-tsc.sh` como alternativa
3. Teste localmente primeiro

### "Cannot find module '@nestjs/...'"
**Causa:** Dependências faltando
**Solução:** Certifique-se que todas estão em `dependencies`

## 🧪 Testar Build Localmente

```bash
# Limpar build anterior
rm -rf dist

# Instalar dependências
npm install

# Gerar Prisma
cd database && npx prisma generate && cd ..

# Build
npm run build
# OU
./build.sh

# Verificar
ls -la dist/main.js

# Testar execução
node dist/main.js
```

## 📊 Debug do Build

Se o build falhar, verifique:

1. **Logs completos:**
   ```bash
   ./build.sh 2>&1 | tee build.log
   ```

2. **Versões das dependências:**
   ```bash
   npm list @nestjs/cli typescript
   ```

3. **Estrutura de arquivos:**
   ```bash
   tree src/
   ```

4. **Configuração TypeScript:**
   ```bash
   cat tsconfig.json
   ```

## 📞 Suporte

Se continuar com problemas:
1. Verifique `TROUBLESHOOTING.md`
2. Confira os logs no Render Dashboard
3. Teste o build localmente primeiro
