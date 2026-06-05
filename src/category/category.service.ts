import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}
    
    fetchMany() {
        return 'some categoriesss';
    }

    fetchOneById() {
        return 'one category';
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
