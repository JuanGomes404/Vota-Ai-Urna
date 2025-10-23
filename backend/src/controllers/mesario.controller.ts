import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MesarioService } from '../services/mesario.service';
import { BuscarEleitorDto, HabilitarEleitorDto } from '../models/mesario.dto';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('mesario')
export class MesarioController {
  constructor(
    private readonly mesarioService: MesarioService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('mesario')
  @Get('eleicoes')
  async listarEleicoesAtivas() {
    return await this.mesarioService.listarEleicoesAtivas();
  }

  @UseGuards(RolesGuard)
  @Roles('mesario')
  @Get('eleitores/:eleicaoId')
  async listarEleitoresAptos(@Param('eleicaoId') eleicaoId: string) {
    return await this.mesarioService.listarEleitoresAptos(eleicaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('mesario')
  @Get('eleitor/:matricula')
  async buscarEleitor(
    @Param('matricula') matricula: string,
    @Query('eleicaoId') eleicaoId: string
  ) {
    return await this.mesarioService.buscarEleitor(matricula, eleicaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('mesario')
  @Post('habilitar')
  async habilitarEleitor(@Body() habilitarDto: HabilitarEleitorDto) {
    return await this.mesarioService.habilitarEleitor(habilitarDto.matricula, habilitarDto.eleicaoId);
  }
}
