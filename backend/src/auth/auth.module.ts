import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AdminRepository } from '../repositories/admin.repository';
import { MesarioRepository } from '../repositories/mesario.repository';
import { PrismaService } from '../../database/src/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'vota-ai-secret-key-tcc',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AdminRepository, MesarioRepository, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
