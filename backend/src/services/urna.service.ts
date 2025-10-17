import { Injectable } from '@nestjs/common';
import { VotoDto } from '../models/voto.dto';
import { UrnaRepository } from '../repositories/urna.repository';

@Injectable()
export class UrnaService {
  constructor(private readonly urnaRepository: UrnaRepository) {}

  async validarCredencial(token: string) {
    const credencial = await this.urnaRepository.findCredencialByToken(token);
    if (!credencial) {
      return { error: 'Credencial não encontrada' };
    }
    
    if (credencial.usada) {
      return { error: 'Credencial já foi utilizada' };
    }
    
    return { message: 'Credencial válida', valid: true };
  }

  async confirmarVoto(votoDto: VotoDto) {
    const credencial = await this.urnaRepository.findCredencialByToken(votoDto.token);
    if (!credencial || credencial.usada) {
      return { error: 'Credencial inválida' };
    }
    
    await this.urnaRepository.registrarVoto(votoDto);
    await this.urnaRepository.invalidarCredencial(votoDto.token);
    
    return { message: 'Voto registrado com sucesso!' };
  }

  async listarChapas(eleicaoId: string) {
    return await this.urnaRepository.findChapasByElectionId(eleicaoId);
  }
}
