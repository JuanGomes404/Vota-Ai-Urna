import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for Token
 */
export class TokenDto {
    /**
     * The token sent for authentication or validation
     */
    @IsString()
    @IsNotEmpty()
    token: string;

    /**
     * Optional error message associated with the token
     */
    @IsString()
    @IsOptional()
    errorMessage?: string;

    valido?: boolean;
}