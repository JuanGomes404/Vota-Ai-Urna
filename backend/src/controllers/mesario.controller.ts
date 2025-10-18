import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
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
  @Get('eleitor/:matricula')
  async buscarEleitor(@Param('matricula') matricula: string) {
    return await this.mesarioService.buscarEleitor(matricula);
  }

  @UseGuards(RolesGuard)
  @Roles('mesario')
  @Post('habilitar')
  async habilitarEleitor(@Body() habilitarDto: HabilitarEleitorDto) {
    return await this.mesarioService.habilitarEleitor(habilitarDto.matricula);
  }
}
