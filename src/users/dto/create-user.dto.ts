import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  company_id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  role_id: number;
}
