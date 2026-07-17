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

    async findMany(category_id: string) {
        return await this.repository.find({ where: { category_id } });
    }

    async findByCategoryId(category_id: string) {
        return await this.repository.find({ where: { category_id } });
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
