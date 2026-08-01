import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users') 
export class User { 
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email!: string | null;

    @Column({ type: 'varchar', nullable: true, unique: true})
    phone!: string | null;

    @Column({ default: false })
    email_verified!: boolean;

    @Column({ default: false })
    phone_verified!: boolean;

    @Column({ nullable:true })
    last_login_at?:Date;

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}