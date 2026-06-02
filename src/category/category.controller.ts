import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getAllCategories() {
        return this.categoryService.fetchMany();
    }

    @Get(':id')
    getCategoryById() {
        return this.categoryService.fetchOneById();
    }

    @Post()
    createCategory() {
        return this.categoryService.create();
    }

    @Put(':id')
    updateCategory() {
        return this.categoryService.update();
    }

    @Delete(':id')
    deleteCategory() {
        return this.categoryService.delete();
    }
}
