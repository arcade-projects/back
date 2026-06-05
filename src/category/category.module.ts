import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
    exports: [
        CategoryService
    ],
    providers: [
        CategoryService
    ],
    controllers: [
        CategoryController
    ],
    imports: [TypeOrmModule.forFeature([Category])]
})
export class CategoryModule {}
