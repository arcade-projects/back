import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'sub_categories' })
export class SubCategory {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'uuid' })
    category_id!: string;

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}