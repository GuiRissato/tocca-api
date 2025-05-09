import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskTagDto } from './create-task_tag.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskTagDto extends PartialType(CreateTaskTagDto) {
    @ApiPropertyOptional({
        description: 'ID da tarefa que será associada à tag',
        example: 3,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    task_id?: number;

    @ApiPropertyOptional({
        description: 'ID da tag que será associada à tarefa',
        example: 4,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    tag_id?: number;
}
