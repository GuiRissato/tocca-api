import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Objective } from '../../objectives/entities/objective.entity';

@Entity()
export class KeyResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  objective_id: number;

  @ManyToOne(() => Objective)
  @JoinColumn({ name: 'objective_id' })
  objective: Objective;

  @Column()
  key_result_name: string;

  @Column('text')
  description: string;

  @Column()
  status: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
