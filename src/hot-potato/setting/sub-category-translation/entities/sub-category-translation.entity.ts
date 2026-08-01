import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({ name: 'sub_category_translations' })
@Unique(['sub_category_id', 'locale'])
export class SubCategoryTranslation {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    sub_category_id!: string;

    @Column({ type: 'varchar', length: 10 })
    locale!: string;

    @Column({ type: 'varchar' , length: 255 })
    name!: string;

    @Column({ type: 'boolean', default: true })
    activate!: Boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}