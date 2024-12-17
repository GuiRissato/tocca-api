import { KeyResults } from '../../key_results/entities/key_result.entity';
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
export class ColumnsKeyResults {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key_result_id: number;

  @ManyToOne(() => KeyResults)
  @JoinColumn({ name: 'key_result_id' })
  keyResult: KeyResults;

  @Column()
  column_name: string;

  @Column()
  position: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
