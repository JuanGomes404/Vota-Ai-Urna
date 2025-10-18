import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      console.log('🔄 Inicializando banco de dados...');
      
      // Executar migrações do Prisma
      await this.runPrismaMigrations();
      
      // Executar script de dados iniciais
      await this.runInitData();
      
      console.log('✅ Banco de dados inicializado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error);
    }
  }

  private async runPrismaMigrations() {
    try {
      console.log('📊 Executando migrações do Prisma...');
      
      // Verificar se as tabelas existem
      const tables = await this.prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('Administrador', 'Mesario', 'Eleicao')
      `;

      if (Array.isArray(tables) && tables.length === 0) {
        console.log('⚠️ Tabelas não encontradas. Execute: npx prisma migrate deploy');
      } else {
        console.log('✅ Tabelas encontradas:', tables.map((t: any) => t.table_name));
      }
    } catch (error) {
      console.error('Erro ao verificar migrações:', error);
    }
  }

  private async runInitData() {
    try {
      console.log('📝 Executando dados iniciais...');
      
      // Verificar se já existem dados
      const adminCount = await this.prisma.administrador.count();
      const mesarioCount = await this.prisma.mesario.count();
      
      if (adminCount === 0 && mesarioCount === 0) {
        console.log('📄 Executando script de dados iniciais...');
        
        // Ler e executar o script SQL
        const initScriptPath = path.join(__dirname, 'init-data.sql');
        
        if (fs.existsSync(initScriptPath)) {
          const initScript = fs.readFileSync(initScriptPath, 'utf8');
          await this.prisma.$executeRawUnsafe(initScript);
          console.log('✅ Dados iniciais criados com sucesso!');
        } else {
          console.log('⚠️ Script de dados iniciais não encontrado');
        }
      } else {
        console.log('✅ Dados iniciais já existem');
      }
    } catch (error) {
      console.error('Erro ao executar dados iniciais:', error);
    }
  }
}
