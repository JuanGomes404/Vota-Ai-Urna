import { Injectable } from '@nestjs/common';
import { VotoDto } from '../model/voto.dto';
import { IdentidadeClientService } from './identidade-client.service';
import { TokenDto } from '../model/token.dto';
import { UrnaRepository } from '../repository/urna.repository';

@Injectable()
export class UrnaService {
    constructor(private readonly identidadeClient: IdentidadeClientService, private readonly urnaRepository: UrnaRepository) { }

    // RF13: Tela de confirmação
    async confirmarVoto(votoDto: VotoDto) {
        const credencial = await this.validarCredencial(votoDto.token);
        if ('error' in credencial || !credencial.valido) {
            return { error: 'Credencial inválida ou já utilizada.' };
        }
        // Continua com o processo de confirmação do voto
        return this.urnaRepository.registrarVoto(votoDto);
    }
    async validarCredencial(token: string) {
        const validacao: TokenDto = await this.identidadeClient.validarIdentidade(token);
        if (!validacao.valido) {
            return { error: 'Credencial inválida ou já utilizada.' };
        }
        return validacao;
    }

    // RF12: Listar chapas concorrentes
    async listarChapas(eleicaoId: string) {
        // Retorna todas as chapas da eleição do banco de dados
        return await this.urnaRepository.findChapasByElectionId(eleicaoId);
    }



}
