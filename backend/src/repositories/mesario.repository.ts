import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';

@Injectable()
export class MesarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsuario(usuario: string) {
    return await this.prisma.mesario.findUnique({
      where: { usuario }
    });
  }

  // RN05: Apenas eleitores da lista oficial podem ser habilitados
  async findEleitorByMatricula(matricula: string) {
    return await this.prisma.eleitor.findUnique({
      where: { matricula }
    });
  }

  // RN06: Verificar se eleitor já votou
  async isEleitorJaVotou(matricula: string) {
    const eleitor = await this.prisma.eleitor.findUnique({
      where: { matricula }
    });
    return eleitor?.jaVotou || false;
  }

  // RN09: Gerar credencial de uso único
  async gerarCredencial(eleitorId: string, eleicaoId: string) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return await this.prisma.credencial.create({
      data: {
        token,
        eleitorId,
        eleicaoId,
        usada: false
      }
    });
  }

  // RN07: Marcar eleitor como votou (irreversível)
  async marcarEleitorComoVotou(eleitorId: string) {
    return await this.prisma.eleitor.update({
      where: { id: eleitorId },
      data: { jaVotou: true }
    });
  }

  // RN08: Verificar se eleitor está habilitado para votar
  async verificarHabilitacao(eleitorId: string, eleicaoId: string) {
    const credencial = await this.prisma.credencial.findFirst({
      where: {
        eleitorId,
        eleicaoId,
        usada: false
      }
    });
    return !!credencial;
  }
}
