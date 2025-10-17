import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';
import { VotoDto } from '../models/voto.dto';

@Injectable()
export class UrnaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findChapasByElectionId(eleicaoId: string) {
    return await this.prisma.chapa.findMany({
      where: { eleicaoId: eleicaoId },
    });
  }

  async registrarVoto(voto: VotoDto) {
    const credencial = await this.prisma.credencial.findUnique({ where: { token: voto.token } });

    if (!credencial) return { error: 'Credencial não encontrada' };

    // Registra o voto de forma anônima
    await this.prisma.voto.create({
      data: {
        eleicaoId: voto.eleicaoId,
        chapaId: voto.chapaId,
      },
    });
  
    await this.prisma.credencial.update({ where: { token: voto.token }, data: { usada: true } });

    await this.prisma.eleitor.update({ where: { id: credencial.eleitorId }, data: { jaVotou: true } });
    return { message: 'Voto registrado, credencial invalidada e eleitor marcado como já votou.' };
  }
}
