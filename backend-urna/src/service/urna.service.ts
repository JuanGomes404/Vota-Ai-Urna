import { Injectable } from '@nestjs/common';
import { VotoDto } from '../model/voto.dto';
import { IdentidadeClientService } from './identidade-client.service';
import { UrnaRepository } from '../repository/urna.repository';

@Injectable()
export class UrnaService {
    constructor(private readonly identidadeClient: IdentidadeClientService, private readonly urnaRepository: UrnaRepository) { }

    async confirmarVoto(votoDto: VotoDto) {
        const credencial = await this.validarCredencial(votoDto.token);
        if (!credencial || credencial.error) {
            return { error: 'Credencial inválida' };
        }
        return this.urnaRepository.registrarVoto(votoDto);
    }
    async validarCredencial(token: string) {
        return this.identidadeClient.validarIdentidade(token);
    }
    async listarChapas(eleicaoId: string) {
        return await this.urnaRepository.findChapasByElectionId(eleicaoId);
    }



}
