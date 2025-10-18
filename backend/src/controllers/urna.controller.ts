import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { VotoDto } from '../models/voto.dto';
import { UrnaService } from '../services/urna.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('urna')
export class UrnaController {
  constructor(private readonly urnaService: UrnaService) {}

  // Endpoint público para validar credencial (sem autenticação)
  @Post('validar-credencial')
  async validarCredencial(@Body() body: { token: string }) {
    return await this.urnaService.validarCredencial(body.token);
  }

  // Endpoint público para listar chapas (sem autenticação)
  @Get('chapas')
  async listarChapas(@Query('eleicaoId') eleicaoId: string) {
    return await this.urnaService.listarChapas(eleicaoId);
  }

  // Endpoint público para confirmar voto (sem autenticação)
  @Post('confirmar')
  async confirmarVoto(@Body() votoDto: VotoDto) {
    return await this.urnaService.confirmarVoto(votoDto);
  }

  // Endpoint protegido para mesários verificarem status da urna
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mesario')
  @Get('status')
  async statusUrna() {
    return { 
      message: 'Urna operacional',
      timestamp: new Date().toISOString(),
      status: 'ativa'
    };
  }
}
