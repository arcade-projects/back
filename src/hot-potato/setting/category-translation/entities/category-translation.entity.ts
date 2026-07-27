import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'category_translations' })
@Unique(['category_id', 'locale'])
export class CategoryTranslation {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    category_id!: string;

    @Column({ type: 'varchar', length: 10 })
    locale!: string;

    @Column({ type: 'varchar' , length: 255 })
    name!: string;
}