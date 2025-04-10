import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'ID da empresa do usuário',
    example: 1,
  })
  @IsInt()
  company_id: number;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'joaosilva',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'ID do papel/função do usuário no sistema',
    example: 2,
  })
  @IsInt()
  role_id: number;
}
