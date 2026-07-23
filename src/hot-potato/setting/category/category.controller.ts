import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async findMany() {
        return this.categoryService.findMany();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.categoryService.findById(id);
    }

    @Post()
    async createCategory(@Body() data: any) {
        await this.categoryService.create(data);
        return this.categoryService.findMany();
    }

    @Put(':id')
    updateCategory() {
        return this.categoryService.update();
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        await this.categoryService.delete(id);
        return this.categoryService.findMany();
    }
}
