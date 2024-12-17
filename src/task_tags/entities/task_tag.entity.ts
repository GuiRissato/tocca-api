import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';"typeorm";
import { Tasks } from '../../tasks/entities/task.entity';
import { Tags } from '../../tags/entities/tag.entity';

@Entity()
export class TaskTags {
    @PrimaryColumn()
     task_id: number;

     @ManyToOne(() => Tasks)
     @JoinColumn({ name: 'task_id' })
     task: Tasks;

     @PrimaryColumn()
     tag_id: number;

     @ManyToOne(() => Tags)
     @JoinColumn({ name: 'tag_id' })
     tag: Tags;

     @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
     created_at: Date;

     @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
     updated_at: Date;
}
