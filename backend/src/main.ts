import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração CORS para permitir requisições do frontend
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Frontend local (Vite)
      'http://localhost:3000',  // Frontend local alternativo
      'http://localhost:3001',  // Frontend local alternativo
      'https://vota-ai-urna-frontend.onrender.com',  // Frontend em produção
      'https://vota-ai-frontend.onrender.com',  // Frontend alternativo
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
