import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryService } from '../sub_category/sub_category.service';
import { CategoryTranslation } from '../category-translation/entities/category-translation.entity';
import { BaseService } from 'src/common/database/base.service';
import { SubCategory } from '../sub_category/entities/sub_category.entity';
import { SubCategoryTranslation } from '../sub-category-translation/entities/sub-category-translation.entity';

@Injectable()
export class CategoryService extends BaseService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        private subCategoryService: SubCategoryService,

        dataSource: DataSource,
    ) {
        super(dataSource)
    }
    
    async findMany() {
        const categories = await this.categoryRepository.find();

        const result = categories.map(async category => {
            return {
                'id': category.id,
                'sub_categories': await this.subCategories(category)
            }
        });

        return Promise.all(result);
    }

    async subCategories(category: Category) {
        const subCategories = await this.subCategoryService.findMany(category.id);
        return subCategories.map(subCategory => {
            return {
                'id': subCategory.id,
            }
        });
    }

    async findByLocale(locale: string, manager?: EntityManager) {

        const queryBuilder = manager
            ? manager.createQueryBuilder(Category, 'c')
            : this.categoryRepository.createQueryBuilder('c');

        const categories = await queryBuilder
            .innerJoin(
                CategoryTranslation,
                'ct',
                'ct.category_id = c .id AND ct.locale = :locale',
                { locale }
            )
            .select([
                'c.id AS id',
                'c.activate AS activate',
                'ct.name AS name'
            ])
            .where('c.activate = :activate', { activate: true })
            .getRawMany();

        return categories.map((category) => ({
            id: category.id,
            activate: category.activate,
            name: category.name || null
        }))
    }

    async findById(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async create(categories: { locale: string; name: string }[], lang: string) {

        return this.runInTransaction(async (manager) => {

            const createCategory = manager.create(Category, {});
            const savedCategory = await manager.save(createCategory);

            const createCategoryTranslations = categories.map((item) => manager.create(CategoryTranslation, {
                    category_id: savedCategory.id,
                    locale: item.locale,
                    name: item.name,
                }),
            );

            await manager.save(createCategoryTranslations)

            return await this.findByLocale(lang, manager);
        })
    }

    update() {
        return 'category updatedss';
    }

    async deleteTranslationByLocale(categoryId: string, locale: string) {
        return await this.runInTransaction(async (manager) => {
            const subCategories = await manager
                .createQueryBuilder(SubCategory, 'sc')
                .select('sc.id', 'id')
                .where('sc.category_id = :categoryId', { categoryId })
                .getRawMany();

            const subCategoryIds = subCategories.map((subCategory) => subCategory.id);

            if (subCategoryIds.length > 0) {
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from(SubCategoryTranslation)
                    .where('sub_category_id IN (:...subCategoryIds)', { subCategoryIds })
                    .andWhere('locale = :locale', { locale })
                    .execute();
            }

            await manager
                .createQueryBuilder()
                .delete()
                .from(CategoryTranslation)
                .where('category_id = :categoryId', { categoryId })
                .andWhere('locale = :locale', { locale })
                .execute();

            return await this.findByLocale(locale, manager);
        })
    }
}
