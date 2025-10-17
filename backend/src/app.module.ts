import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { MesarioController } from './controllers/mesario.controller';
import { IdentidadeController } from './controllers/identidade.controller';
import { UrnaController } from './controllers/urna.controller';
import { AdminService } from './services/admin.service';
import { MesarioService } from './services/mesario.service';
import { IdentidadeService } from './services/identidade.service';
import { UrnaService } from './services/urna.service';
import { AdminRepository } from './repositories/admin.repository';
import { MesarioRepository } from './repositories/mesario.repository';
import { UrnaRepository } from './repositories/urna.repository';
import { PrismaService } from '../database/src/prisma.service';

@Module({
  controllers: [AdminController, MesarioController, IdentidadeController, UrnaController],
  providers: [
    AdminService, 
    MesarioService, 
    IdentidadeService, 
    UrnaService,
    AdminRepository,
    MesarioRepository,
    UrnaRepository,
    PrismaService
  ],
})
export class AppModule {}
