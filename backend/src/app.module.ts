import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IdentidadeController } from './controllers/identidade.controller';
import { UrnaController } from './controllers/urna.controller';
import { IdentidadeService } from './services/identidade.service';
import { UrnaService } from './services/urna.service';
import { UrnaRepository } from './repositories/urna.repository';
import { PrismaService } from '../database/src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [IdentidadeController, UrnaController],
  providers: [IdentidadeService, UrnaService, UrnaRepository, PrismaService],
})
export class AppModule {}
