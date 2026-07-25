import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';

@Controller('category/:category_id/sub-category')
export class SubCategoryController {

    constructor(
        private readonly subCategoryService: SubCategoryService
    ) {}

    @Get()
    findMany(@Param('category_id') categoryId: string) {
        return this.subCategoryService.findMany(categoryId);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.subCategoryService.findById(id);
    }

    @Post()
    async create(@Body() data: any) {
        await this.subCategoryService.create(data);
        return this.subCategoryService.findMany(data.category_id);
    }

    update() {}

    @Delete(':sub_category_id')
    async delete(
        @Param('category_id') categoryId: string,
        @Param('sub_category_id') subCategoryId: string
    ) {
        await this.subCategoryService.delete(subCategoryId);
        return this.subCategoryService.findMany(categoryId);
    }
}
