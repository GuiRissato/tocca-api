import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tasks } from '../../tasks/entities/task.entity';
import { Users } from '../../users/entities/user.entity';

@Entity()
export class TaskAssignees {
    @PrimaryColumn()
    task_id: number;

    @ManyToOne(() => Tasks)
    @JoinColumn({ name: 'task_id' })
    task: Tasks;

    @PrimaryColumn()
    user_id: number;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}