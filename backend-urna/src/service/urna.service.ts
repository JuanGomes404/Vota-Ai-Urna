import { Injectable } from '@nestjs/common';
import { VotoDto } from '../model/voto.dto';
import { IdentidadeClientService } from './identidade-client.service';

@Injectable()
export class UrnaService {
    constructor(private readonly identidadeClient: IdentidadeClientService) { }

    async registrarVoto(votoDto: VotoDto) {
        // Exemplo: valida credencial via microserviço de identidade
        const validacao: any = await this.identidadeClient.validarIdentidade(votoDto.token);
        if (!validacao || validacao.data?.error) {

            return { error: 'Credencial inválida ou expirada. ' };
        }
        // Lógica de registro anônimo do voto (MVP: apenas retorna sucesso)
        this.consolidarVotoBase(votoDto);
        return { message: 'Voto registrado com sucesso.' };
    }
    private consolidarVotoBase(votoDto: VotoDto) {
        // Lógica para consolidar o voto na base de dados
        // Esta função é um placeholder e deve ser implementada conforme a lógica de negócio
        
        console.log(`Voto para a chapa ${votoDto.slateId} registrado com sucesso.`);
    }
}
