import { ColumnsKeyResult } from "../../columns_key_result/entities/columns_key_result.entity";
import { KeyResult } from "../../key_results/entities/key_result.entity";
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
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key_result_id: number;

    @ManyToOne(() => KeyResult)
    @JoinColumn({name: 'key_result_id'})
    keyResultId: KeyResult;

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

    @ManyToOne(() => ColumnsKeyResult)
    @JoinColumn({name: 'column_key_result_id'})
    columnKeyResultId: ColumnsKeyResult;    

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
