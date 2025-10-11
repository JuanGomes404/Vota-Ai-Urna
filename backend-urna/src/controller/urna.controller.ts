import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VotoDto } from '../model/voto.dto';
import { UrnaService } from '../service/urna.service';

@Controller('urna')
export class UrnaController {


  constructor(private readonly urnaService: UrnaService) {}

  // RF12: Exibe opções de voto (chapas)
  @Get('chapas')
  listarChapas(@Query('eleicaoId') eleicaoId: string) {
    return this.urnaService.listarChapas(eleicaoId);
  }

  // RF13: Tela de confirmação antes de registrar o voto
  @Post('confirmar')
  confirmarVoto(@Body() votoDto: VotoDto) {
    // Retorna dados para confirmação (exemplo: nome da chapa)
    return this.urnaService.confirmarVoto(votoDto);
  }


}
