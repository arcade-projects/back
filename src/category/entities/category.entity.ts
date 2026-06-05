import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    title!: string;
}