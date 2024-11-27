import { Companies } from '../../companies/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Tags {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag_name: string;

    @Column()
    company_id: number;

    @ManyToOne(() => Companies)
    @JoinColumn({ name: 'company_id' })
    company: Companies;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}