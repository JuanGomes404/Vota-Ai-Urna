import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
        console.log('✅ Tabelas encontradas:', (tables as any[]).map((t: any) => t.table_name));
      }
    } catch (error) {
      console.error('Erro ao verificar migrações:', error);
    }
  }

  private async runInitData() {
    try {
      console.log('📝 Executando dados iniciais...');
      
      // Verificar se as tabelas existem antes de tentar contar
      const tables = await this.prisma.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('Administrador', 'Mesario')
      `;

      if (!tables || tables.length < 2) {
        console.log('⚠️ Tabelas não encontradas. Pulando inicialização de dados.');
        console.log('💡 Execute: npx prisma migrate deploy');
        return;
      }
      
      // Verificar se já existem dados
      const adminCount = await this.prisma.administrador.count();
      const mesarioCount = await this.prisma.mesario.count();
      
      if (adminCount === 0 && mesarioCount === 0) {
        console.log('📄 Criando dados iniciais via Prisma...');
        
        try {
          // Criar admin padrão
          await this.prisma.administrador.create({
            data: {
              nome: 'Administrador Vota Ai',
              email: 'admin@vota-ai.com',
              senha: 'admin123',
            },
          });
          console.log('✅ Administrador criado: admin@vota-ai.com / admin123');

          // Criar mesário padrão
          await this.prisma.mesario.create({
            data: {
              nome: 'Mesário Vota Ai',
              usuario: 'mesario01',
              senha: 'mesario123',
            },
          });
          console.log('✅ Mesário criado: mesario01 / mesario123');
          
          console.log('✅ Dados iniciais criados com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao criar dados iniciais:', error);
          throw error;
        }
      } else {
        console.log('✅ Dados iniciais já existem');
        console.log(`   - Administradores: ${adminCount}`);
        console.log(`   - Mesários: ${mesarioCount}`);
      }
    } catch (error) {
      console.error('Erro ao executar dados iniciais:', error);
      throw error; // Re-throw para garantir que o erro seja visível
    }
  }
}
