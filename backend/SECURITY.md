# 🔒 SEGURANÇA - CREDENCIAIS SENSÍVEIS

## ⚠️ IMPORTANTE

Este arquivo `.env` contém credenciais sensíveis e **NUNCA** deve ser commitado no Git!

## ✅ O que fazer

1. **Para desenvolvimento local:**
   - Copie `.env.example` para `.env`
   - Preencha com suas credenciais locais
   - O arquivo `.env` já está no `.gitignore`

2. **Para produção no Render:**
   - Configure as variáveis de ambiente diretamente no Dashboard do Render
   - Nunca coloque credenciais reais em arquivos de configuração commitados

## 🚫 O que NÃO fazer

- ❌ Nunca commite o arquivo `.env`
- ❌ Nunca coloque credenciais em arquivos YAML/JSON commitados
- ❌ Nunca compartilhe senhas em mensagens de commit
- ❌ Nunca exponha tokens ou secrets em logs

## 🔐 Variáveis Sensíveis

As seguintes variáveis contêm informações sensíveis:

- `DATABASE_URL` / `DB_PASSWORD` - Credenciais do banco de dados
- `SECRET` - Chave secreta para JWT
- Qualquer token de API ou chave de serviço

## 📋 Checklist de Segurança

Antes de fazer commit:

- [ ] Verifique se `.env` está no `.gitignore`
- [ ] Verifique se não há credenciais em arquivos YAML/JSON
- [ ] Use placeholders em arquivos de exemplo
- [ ] Configure variáveis de ambiente no Render Dashboard

## 🆘 Se você acidentalmente commitou credenciais

1. **IMEDIATO:** Altere todas as senhas e tokens expostos
2. Remova o commit do histórico (use `git filter-branch` ou BFG Repo-Cleaner)
3. Force push após limpar o histórico
4. Notifique sua equipe sobre o incidente

## 📚 Recursos

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [Best Practices for Secrets Management](https://render.com/docs/deploy-keys)
