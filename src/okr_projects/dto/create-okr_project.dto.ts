import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateOkrProjectDto {
  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  project_name: string;

  @IsOptional()
  @IsString()
  description: string;
}
