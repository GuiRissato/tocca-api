import { IsNotEmpty, IsString, IsInt, IsDate } from 'class-validator';

export class CreateObjectiveDto {
  @IsInt()
  @IsNotEmpty()
  project_id: number;

  @IsString()
  @IsNotEmpty()
  objective_name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;
}
