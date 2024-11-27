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
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key_result_id: number;

    @ManyToOne(() => KeyResults)
    @JoinColumn({name: 'key_result_id'})
    keyResultId: KeyResults;

    @Column()
    task_name: string;

    @Column('text')
    description: string;

    @Column()
    delay_reason: string;

    @Column()
    priority: number;

    @Column({ type: 'date' })
    due_date: Date;

    @Column()
    column_key_result_id: number;

    @ManyToOne(() => ColumnsKeyResults)
    @JoinColumn({name: 'column_key_result_id'})
    columnKeyResultId: ColumnsKeyResults;    

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
