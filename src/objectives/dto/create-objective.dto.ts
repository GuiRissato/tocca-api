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

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;
}
