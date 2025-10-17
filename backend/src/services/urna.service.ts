import { Injectable } from '@nestjs/common';
import { VotoDto } from '../models/voto.dto';
import { IdentidadeService } from './identidade.service';
import { UrnaRepository } from '../repositories/urna.repository';

@Injectable()
export class UrnaService {
  constructor(
    private readonly identidadeService: IdentidadeService,
    private readonly urnaRepository: UrnaRepository
  ) {}

  async confirmarVoto(votoDto: VotoDto) {
    const credencial = await this.validarCredencial(votoDto.token);
    if (!credencial || credencial.error) {
      return { error: 'Credencial inválida' };
    }
    return this.urnaRepository.registrarVoto(votoDto);
  }

  async validarCredencial(token: string) {
    // Agora chama diretamente o serviço de identidade local ao invés de fazer HTTP
    return this.identidadeService.validarIdentidade({ token });
  }

  async listarChapas(eleicaoId: string) {
    return await this.urnaRepository.findChapasByElectionId(eleicaoId);
  }
}
