import { Companies } from '../../companies/entities/company.entity';
import { Roles } from '../../roles/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @ManyToOne(() => Companies)
  @JoinColumn({ name: 'company_id' })
  company: Companies;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role_id: number;

  @ManyToOne(() => Roles)
  @JoinColumn({name: 'role_id'})
  role: Roles;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
