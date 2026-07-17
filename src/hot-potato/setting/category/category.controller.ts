import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    findMany() {
        return this.categoryService.findMany();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.categoryService.findById(id);
    }

    @Post()
    createCategory(@Body() data: any) {
        return this.categoryService.create(data);
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
