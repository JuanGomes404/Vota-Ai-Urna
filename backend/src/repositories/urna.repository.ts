import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';
import { VotoDto } from '../models/voto.dto';

@Injectable()
export class UrnaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // RN03: Só exibe chapas se eleição estiver ativa
  async findChapasByElectionId(eleicaoId: string) {
    const eleicao = await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId }
    });

    if (!eleicao?.ativa) {
      throw new Error("Eleição não está ativa para votação");
    }

    return await this.prisma.chapa.findMany({
      where: { eleicaoId: eleicaoId },
    });
  }

  // RN11: Validar credencial antes do uso
  async findCredencialByToken(token: string) {
    return await this.prisma.credencial.findUnique({
      where: { token }
    });
  }

  // RN10: Registro anônimo de voto (sem dados pessoais)
  async registrarVoto(voto: VotoDto) {
    return await this.prisma.voto.create({
      data: {
        eleicaoId: voto.eleicaoId,
        chapaId: voto.chapaId,
        // RN13: Não armazena dados que identifiquem o eleitor
      },
    });
  }

  // RN11: Invalidação permanente da credencial
  async invalidarCredencial(token: string) {
    return await this.prisma.credencial.update({
      where: { token },
      data: { usada: true }
    });
  }

  // RN08: Verificar se eleitor foi habilitado por mesário
  async verificarHabilitacaoEleitor(token: string) {
    const credencial = await this.prisma.credencial.findUnique({
      where: { token },
      include: {
        eleitor: true,
        eleicao: true
      }
    });

    if (!credencial) {
      return { error: "Credencial não encontrada" };
    }

    if (credencial.usada) {
      return { error: "Credencial já foi utilizada" };
    }

    if (!credencial.eleicao.ativa) {
      return { error: "Eleição não está ativa" };
    }

    return { valid: true, credencial };
  }
}
