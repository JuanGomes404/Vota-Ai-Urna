import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MesarioService } from '../services/mesario.service';
import { MesarioLoginDto, BuscarEleitorDto, HabilitarEleitorDto } from '../models/mesario.dto';

@Controller('mesario')
export class MesarioController {
  constructor(private readonly mesarioService: MesarioService) {}

  @Post('login')
  async login(@Body() loginDto: MesarioLoginDto) {
    return await this.mesarioService.login(loginDto);
  }

  @Get('eleitor/:matricula')
  async buscarEleitor(@Param('matricula') matricula: string) {
    return await this.mesarioService.buscarEleitor(matricula);
  }

  @Post('habilitar')
  async habilitarEleitor(@Body() habilitarDto: HabilitarEleitorDto) {
    return await this.mesarioService.habilitarEleitor(habilitarDto.matricula);
  }
}
