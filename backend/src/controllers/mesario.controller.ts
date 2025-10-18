import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MesarioService } from '../services/mesario.service';
import { BuscarEleitorDto, HabilitarEleitorDto } from '../models/mesario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('mesario')
export class MesarioController {
  constructor(
    private readonly mesarioService: MesarioService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mesario')
  @Get('eleitor/:matricula')
  async buscarEleitor(@Param('matricula') matricula: string) {
    return await this.mesarioService.buscarEleitor(matricula);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mesario')
  @Post('habilitar')
  async habilitarEleitor(@Body() habilitarDto: HabilitarEleitorDto) {
    return await this.mesarioService.habilitarEleitor(habilitarDto.matricula);
  }
}
