import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sub_categories' })
export class SubCategory {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    category_id!: string;

    @Column({ type: 'varchar', unique: true })
    title!: string;
}