import { OkrProjects } from '../../okr_projects/entities/okr_project.entity';
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
export class Objectives {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @ManyToOne(() => OkrProjects)
  @JoinColumn({ name: 'project_id' })
  project: OkrProjects;

  @Column()
  objective_name: string;

  @Column('text')
  description: string;

  @Column()
  status: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
