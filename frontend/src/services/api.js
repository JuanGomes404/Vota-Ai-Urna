import axios from 'axios'

// Configuração base do axios
// Em produção, usa a variável de ambiente VITE_API_URL
// Em desenvolvimento, usa o proxy configurado no vite.config.js

// Determinar a baseURL corretamente
const getBaseURL = () => {
  const viteApiUrl = import.meta.env.VITE_API_URL
  const isDev = import.meta.env.DEV
  
  console.log('🔧 Environment Check:')
  console.log('  - MODE:', import.meta.env.MODE)
  console.log('  - DEV:', isDev)
  console.log('  - PROD:', import.meta.env.PROD)
  console.log('  - VITE_API_URL:', viteApiUrl || 'não definida')
  
  // Se VITE_API_URL está definida, use-a (produção)
  if (viteApiUrl) {
    console.log('✅ Usando VITE_API_URL:', viteApiUrl)
    return viteApiUrl
  }
  
  // Em desenvolvimento, use o proxy /api
  if (isDev) {
    console.log('✅ Usando proxy /api (desenvolvimento)')
    return '/api'
  }
  
  // Fallback crítico - não deveria chegar aqui em produção
  console.error('⚠️ CRITICAL: VITE_API_URL não definida em produção!')
  console.error('⚠️ Usando fallback - o login pode não funcionar!')
  return 'https://vota-ai-urna.onrender.com'
}

const baseURL = getBaseURL()

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('🌐 API configurada com baseURL:', baseURL)

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log da requisição
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    
    return config
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${url} - Status: ${status}`)
    
    if (error.response) {
      console.error('  Response data:', error.response.data)
    } else if (error.request) {
      console.error('  Sem resposta do servidor')
      console.error('  Request:', error.request)
    } else {
      console.error('  Erro:', error.message)
    }
    
    if (status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
