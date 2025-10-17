import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VotoDto } from '../models/voto.dto';
import { UrnaService } from '../services/urna.service';

@Controller('urna')
export class UrnaController {
  constructor(private readonly urnaService: UrnaService) {}

  @Post('validar-credencial')
  async validarCredencial(@Body() body: { token: string }) {
    return await this.urnaService.validarCredencial(body.token);
  }

  @Get('chapas')
  async listarChapas(@Query('eleicaoId') eleicaoId: string) {
    return await this.urnaService.listarChapas(eleicaoId);
  }

  @Post('confirmar')
  async confirmarVoto(@Body() votoDto: VotoDto) {
    return await this.urnaService.confirmarVoto(votoDto);
  }
}
