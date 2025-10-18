import { IsString, IsNotEmpty } from 'class-validator';

export class UnifiedLoginDto {
  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}
