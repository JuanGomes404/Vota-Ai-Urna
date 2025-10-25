# Frontend Vue.js - Sistema de Votação Eletrônica

Frontend desenvolvido em Vue.js 3 para o Sistema de Votação Eletrônica Vota AI.

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript
- **Vuetify 3** - Framework de componentes Material Design
- **Vue Router 4** - Roteamento
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos para resultados
- **Vite** - Build tool

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── views/               # Páginas da aplicação
│   │   ├── admin/           # Painel administrativo
│   │   ├── mesario/         # Painel do mesário
│   │   ├── urna/            # Urna eletrônica
│   │   ├── Login.vue        # Página de login
│   │   └── Home.vue         # Página inicial
│   ├── services/            # Serviços de API
│   ├── stores/              # Stores Pinia
│   ├── router/              # Configuração de rotas
│   ├── plugins/             # Plugins Vue
│   └── main.js              # Arquivo principal
├── public/                  # Arquivos estáticos
├── package.json             # Dependências
├── vite.config.js           # Configuração Vite
├── Dockerfile               # Container Docker
└── nginx.conf               # Configuração Nginx
```

## 🎯 Funcionalidades

### Urna Eletrônica (Pública)
- ✅ Validação de credencial
- ✅ Seleção de voto
- ✅ Confirmação de voto
- ✅ Tela de sucesso

### Painel Administrativo
- ✅ Login unificado
- ✅ Dashboard com estatísticas
- ✅ Criação de eleições
- ✅ Gerenciamento de chapas
- ✅ Importação de eleitores
- ✅ Visualização de resultados

### Painel do Mesário
- ✅ Busca de eleitores
- ✅ Validação de identidade
- ✅ Geração de credenciais
- ✅ Autorização de voto

## 🔧 Instalação e Execução

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Docker

```bash
# Build da imagem
docker build -t vota-ai-frontend .

# Executar container
docker run -p 3001:80 vota-ai-frontend
```

### Docker Compose (Sistema Completo)

```bash
# Subir todo o sistema
docker-compose -f docker-compose.full.yml up --build -d

# Parar sistema
docker-compose -f docker-compose.full.yml down
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Banco de Dados**: localhost:5432

## 🔐 Credenciais Padrão

### Administrador
- **Usuário**: admin@vota-ai.com
- **Senha**: admin123

### Mesário
- **Usuário**: mesario01
- **Senha**: mesario123

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops
- 🖥️ Telas grandes (TVs, monitores)

## 🎨 Design System

- **Material Design 3** via Vuetify
- **Cores primárias**: Azul (#1976D2)
- **Tipografia**: Roboto
- **Ícones**: Material Design Icons
- **Tema**: Claro (com suporte a escuro)

## 🔌 Integração com Backend

O frontend se comunica com o backend através de:

- **Autenticação**: JWT tokens
- **API REST**: Axios com interceptors
- **Proxy**: Configurado no Vite para desenvolvimento
- **Nginx**: Proxy reverso em produção

## 🚀 Deploy

### Produção com Docker

```bash
# Build e deploy
docker-compose -f docker-compose.full.yml up --build -d

# Verificar logs
docker-compose -f docker-compose.full.yml logs -f frontend
```

### Variáveis de Ambiente

```env
NODE_ENV=production
VITE_API_URL=http://localhost:3000
```

## 📊 Monitoramento

- **Health Check**: `/health`
- **Logs**: Docker logs
- **Métricas**: Nginx access logs

## 🔧 Desenvolvimento

### Estrutura de Componentes

```vue
<template>
  <!-- Template HTML -->
</template>

<script>
// Lógica JavaScript
</script>

<style scoped>
/* Estilos CSS */
</style>
```

### Serviços de API

```javascript
// Exemplo de serviço
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
}
```

### Stores Pinia

```javascript
// Exemplo de store
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    async login(credentials) {
      // Lógica de login
    }
  }
})
```

## 📝 Licença

Este projeto é parte do TCC da UNIRIO - Sistema de Votação Eletrônica.
