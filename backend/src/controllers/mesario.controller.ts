import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MesarioService } from '../services/mesario.service';
import { AuthService } from '../auth/auth.service';
import { MesarioLoginDto, BuscarEleitorDto, HabilitarEleitorDto } from '../models/mesario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('mesario')
export class MesarioController {
  constructor(
    private readonly mesarioService: MesarioService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: MesarioLoginDto) {
    const user = await this.authService.validateMesario(loginDto.usuario, loginDto.senha);
    if (!user) {
      return { error: 'Credenciais inválidas' };
    }
    
    const token = await this.authService.generateToken(user);
    return { 
      message: 'Login realizado com sucesso', 
      token,
      user: {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        role: user.role
      }
    };
  }

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
