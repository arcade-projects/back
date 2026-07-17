import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryService } from '../sub_category/sub_category.service';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private subCategoryService: SubCategoryService,
    ) {}
    
    async findMany() {
        const categories = await this.categoryRepository.find();

        const result = categories.map(async category => {
            return {
                'id': category.id,
                'title': category.title,
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
                'title': subCategory.title,
            }
        });
    }

    async findById(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    create(data: any) {

        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    update() {
        return 'category updatedss';
    }

    delete() {
        return 'category deleted';
    }
}
