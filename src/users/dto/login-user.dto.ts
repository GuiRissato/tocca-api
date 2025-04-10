import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'joaosilva',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
