import { Injectable } from '@nestjs/common';
import { SubCategory } from './entities/sub_category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubCategoryService {

    constructor(
        @InjectRepository(SubCategory)
        private readonly repository: Repository<SubCategory>
    ) {}

    async findMany(categoryId: string) {
        return await this.repository.find({ where: { category_id: categoryId } });
    }

    async findByCategoryId(categoryId: string) {
        const { titles } = await this.repository
        .createQueryBuilder('sub')
        .select("ARRAY_AGG(sub.title)", "titles")
        .where('sub.category_id = :categoryId', { categoryId })
        .getRawOne();

        return titles;
    }

    async findById(id: string) {
        const subCategory = await this.repository.findOneBy({ id });
        return subCategory;
    }

    async create(data: any) {
        const subCategory = this.repository.create(data);
        return this.repository.save(subCategory);
    }
}
