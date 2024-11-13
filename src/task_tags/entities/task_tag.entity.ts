import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';"typeorm";
import { Task } from '../../tasks/entities/task.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class TaskTag {
    @PrimaryColumn()
     task_id: number;

     @ManyToOne(() => Task)
     @JoinColumn({ name: 'task_id' })
     task: Task;

     @PrimaryColumn()
     tag_id: number;

     @ManyToOne(() => Tag)
     @JoinColumn({ name: 'tag_id' })
     tag: Tag;

     @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
     created_at: Date;

     @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
     updated_at: Date;
}
