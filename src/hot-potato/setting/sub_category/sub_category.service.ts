import { Injectable } from '@nestjs/common';
import { SubCategory } from './entities/sub_category.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryTranslation } from '../sub-category-translation/entities/sub-category-translation.entity';
import { BaseService } from 'src/common/database/base.service';

@Injectable()
export class SubCategoryService extends BaseService {

    constructor(
        @InjectRepository(SubCategory)
        private readonly subCategoryRepository: Repository<SubCategory>,

        dataSource: DataSource,
    ) {
        super(dataSource);
    }

    async findMany(categoryId: string) {
        return await this.subCategoryRepository.find({ where: { category_id: categoryId } });
    }

    async findByLocale(
        categoryId: string,
        locale: string,
        manager?: EntityManager
    ) {
        const queryBuilder = manager
            ? manager.createQueryBuilder(SubCategory, 'sc')
            : this.subCategoryRepository.createQueryBuilder('sc');

        const subCategories = await queryBuilder
            .innerJoin(
                SubCategoryTranslation,
                'sct',
                'sct.sub_category_id = sc.id AND sct.locale = :locale',
                { locale }
            )
            .select([
                'sc.id AS id',
                'sc.category_id AS category_id',
                'sc.activate AS activate',
                'sct.name AS name'
            ])
            .where('sc.category_id = :categoryId', { categoryId })
            .andWhere('sc.activate = :activate', { activate: true })
            .getRawMany();

        return subCategories.map((subCategory) => ({
            id: subCategory.id,
            category_id: subCategory.category_id,
            activate: subCategory.activate,
            name: subCategory.name
        }));
    }

    async findNamesByLocale(categoryId: string, locale: string,) {
        const { names } = await this.subCategoryRepository
        .createQueryBuilder('sub')
        .innerJoin(
            SubCategoryTranslation,
            'sct',
            'sct.sub_category_id = sub.id AND sct.locale = :locale',
            { locale }
        )
        .select("ARRAY_AGG(sct.name)", "names")
        .where('sub.category_id = :categoryId', { categoryId })
        .getRawOne();

        return names;
    }

    async findById(id: string) {
        const subCategory = await this.subCategoryRepository.findOneBy({ id });
        return subCategory;
    }

    async create(body: { category_id: string; translations: { locale: string; name: string }[] }, lang: string) {
        return this.runInTransaction(async (manager) => {
            const createSubCategory = manager.create(SubCategory, {
                category_id: body.category_id,
            });
            const savedSubCategory = await manager.save(createSubCategory);

            const createSubCategoryTranslations = body.translations.map((item) => 
                manager.create(SubCategoryTranslation, {
                    sub_category_id: savedSubCategory.id,
                    locale: item.locale,
                    name: item.name
                })
            );

            await manager.save(createSubCategoryTranslations);

            return await this.findByLocale(body.category_id, lang, manager);
        });
    }

    async deleteTranslationByLocale(subCategoryId: string, locale: string) {
        return await this.runInTransaction(async (manager) => {
            const subCategory = await manager
                .createQueryBuilder(SubCategory, 'sc')
                .select(['sc.id AS id', 'sc.category_id AS category_id'])
                .where('sc.id = :subCategoryId', { subCategoryId })
                .getRawOne();

            if(!subCategory) {
                return [];
            }

            const categoryId = subCategory.category_id;

            await manager
                .createQueryBuilder()
                .delete()
                .from(SubCategoryTranslation)
                .where('sub_category_id = :subCategoryId', { subCategoryId })
                .andWhere('locale = :locale', { locale })
                .execute();

            return await this.findByLocale(categoryId, locale, manager);
        });
    }
}
