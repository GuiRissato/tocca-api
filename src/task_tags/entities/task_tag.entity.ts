import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tasks } from '../../tasks/entities/task.entity';
import { Tags } from '../../tags/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TaskTags {
    @ApiProperty({
        description: 'ID da tarefa associada à tag',
        example: 1,
        type: Number,
    })
    @PrimaryColumn()
    task_id: number;

    @ApiProperty({
        description: 'Relacionamento com a tarefa',
        type: () => Tasks,
    })
    @ManyToOne(() => Tasks)
    @JoinColumn({ name: 'task_id' })
    task: Tasks;

    @ApiProperty({
        description: 'ID da tag associada à tarefa',
        example: 2,
        type: Number,
    })
    @PrimaryColumn()
    tag_id: number;

    @ApiProperty({
        description: 'Relacionamento com a tag',
        type: () => Tags,
    })
    @ManyToOne(() => Tags)
    @JoinColumn({ name: 'tag_id' })
    tag: Tags;

    @ApiProperty({
        description: 'Data de criação do registro',
        example: '2023-01-15T08:30:00Z',
    })
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty({
        description: 'Data da última atualização do registro',
        example: '2023-01-15T08:30:00Z',
    })
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
