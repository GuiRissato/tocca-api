import { Company } from '../../companies/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag_name: string;

    @Column()
    company_id: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}