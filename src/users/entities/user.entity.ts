import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role_id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}