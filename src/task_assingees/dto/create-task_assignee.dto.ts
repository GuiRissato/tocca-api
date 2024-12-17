import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskAssigneeDto {
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}