
import { ApiProperty } from '@nestjs/swagger';
import { ColumnsKeyResults } from "../../columns_key_result/entities/columns_key_result.entity";
import { KeyResults } from "../../key_results/entities/key_result.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class Tasks {
    @ApiProperty({
        description: 'ID único da tarefa',
        example: 1,
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'ID do resultado-chave associado',
        example: 5,
    })
    @Column()
    key_result_id: number;

    @ApiProperty({
        description: 'Relacionamento com o resultado-chave',
        type: () => KeyResults,
    })
    @ManyToOne(() => KeyResults)
    @JoinColumn({name: 'key_result_id'})
    keyResultId: KeyResults;

    @ApiProperty({
        description: 'Nome da tarefa',
        example: 'Implementar autenticação JWT',
    })
    @Column()
    task_name: string;

    @ApiProperty({
        description: 'Descrição detalhada da tarefa',
        example: 'Implementar sistema de autenticação com JWT para garantir segurança nas rotas da API',
    })
    @Column('text')
    description: string;

    @ApiProperty({
        description: 'Motivo do atraso, se houver',
        example: 'Dependência de serviço externo não disponível',
        required: false,
    })
    @Column()
    delay_reason: string;

    @ApiProperty({
        description: 'Prioridade da tarefa (1-5, onde 5 é a mais alta)',
        example: 3,
        minimum: 1,
        maximum: 5,
    })
    @Column()
    priority: number;

    @ApiProperty({
        description: 'Data de vencimento da tarefa',
        example: '2023-12-31T23:59:59Z',
    })
    @Column({ type: 'timestamptz' })
    due_date: Date;

    @ApiProperty({
        description: 'ID da coluna do quadro kanban onde a tarefa está',
        example: 2,
    })
    @Column()
    column_key_result_id: number;

    @ApiProperty({
        description: 'Relacionamento com a coluna do quadro kanban',
        type: () => ColumnsKeyResults,
    })
    @ManyToOne(() => ColumnsKeyResults)
    @JoinColumn({name: 'column_key_result_id'})
    columnKeyResultId: ColumnsKeyResults;    

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
