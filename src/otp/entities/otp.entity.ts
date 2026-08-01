import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    target!: string;

    @Column({ type: 'enum', enum: ['email', 'phone'] })
    type!: string;

    @Column()
    code!: string;

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;
    
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}