import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class VotoDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsUUID()
  @IsNotEmpty()
  chapaId!: string;

  @IsNotEmpty()
  eleicaoId!: string;
}
