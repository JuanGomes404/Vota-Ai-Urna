import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class VotoDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsOptional()
  @IsUUID()
  chapaId?: string;

  @IsNotEmpty()
  eleicaoId!: string;

  @IsOptional()
  @IsString()
  tipo?: string; // 'valido', 'branco', 'nulo'
}
