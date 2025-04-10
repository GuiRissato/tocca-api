import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID da empresa à qual o usuário pertence',
    example: 1,
  })
  @Column()
  company_id: number;

  @ManyToOne(() => Companies)
  @JoinColumn({ name: 'company_id' })
  company: Companies;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'joaosilva',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Senha hash do usuário (nunca retornada nas respostas)',
    example: '[hash protegido]',
    writeOnly: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'ID do papel/função do usuário',
    example: 1,
  })
  @Column()
  role_id: number;

  @ManyToOne(() => Roles)
  @JoinColumn({name: 'role_id'})
  role: Roles;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-15T08:30:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-15T08:30:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
