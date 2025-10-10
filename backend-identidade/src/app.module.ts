import { Module } from '@nestjs/common';
import { IdentidadeController } from './controller/identidade.controller';
import { IdentidadeService } from './service/identidade.service';

@Module({
  controllers: [IdentidadeController],
  providers: [IdentidadeService],
})
export class AppModule {}
