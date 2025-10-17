import { Controller, Post, Body } from '@nestjs/common';
import { IdentidadeService } from '../services/identidade.service';

@Controller('identidade')
export class IdentidadeController {
  constructor(private readonly identidadeService: IdentidadeService) {}

  @Post('validar')
  async validarIdentidade(@Body() identidadeDto: any) {
    return await this.identidadeService.validarIdentidade(identidadeDto);
  }
}
