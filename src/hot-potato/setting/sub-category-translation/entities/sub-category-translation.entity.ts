import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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
}