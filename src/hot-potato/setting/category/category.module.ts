import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategoryModule } from '../sub_category/sub_category.module';
import { CategoryTranslation } from '../category-translation/entities/category-translation.entity';

@Module({
    exports: [
        CategoryService
    ],
    providers: [
        CategoryService,
    ],
    controllers: [
        CategoryController
    ],
    imports: [TypeOrmModule.forFeature([Category, CategoryTranslation]), SubCategoryModule]
})
export class CategoryModule {}
