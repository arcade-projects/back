import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';

@Controller('sub-category')
export class SubCategoryController {

    constructor(
        private readonly subCategoryService: SubCategoryService
    ) {}

    @Get(':category_id')
    findMany(@Param('category_id') category_id: string) {
        return this.subCategoryService.findMany(category_id);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.subCategoryService.findById(id);
    }

    @Post()
    create(@Body() data: any) {
        return this.subCategoryService.create(data);
    }

    update() {}
}
