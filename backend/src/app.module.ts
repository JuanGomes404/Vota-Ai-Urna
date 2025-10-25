import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MesarioController } from './controllers/mesario.controller';
import { IdentidadeController } from './controllers/identidade.controller';
import { UrnaController } from './controllers/urna.controller';
import { HealthController } from './controllers/health.controller';
import { AdminService } from './services/admin.service';
import { MesarioService } from './services/mesario.service';
import { IdentidadeService } from './services/identidade.service';
import { UrnaService } from './services/urna.service';
import { DatabaseInitService } from './services/database-init.service';
import { AdminRepository } from './repositories/admin.repository';
import { MesarioRepository } from './repositories/mesario.repository';
import { UrnaRepository } from './repositories/urna.repository';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, MesarioController, IdentidadeController, UrnaController, HealthController],
  providers: [
    AdminService,
    MesarioService,
    IdentidadeService,
    UrnaService,
    DatabaseInitService,
    AdminRepository,
    MesarioRepository,
    UrnaRepository,
    PrismaService
  ],
})
export class AppModule {}
