import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { Language } from 'src/common/decorators/language.decorator';

@Controller('categories/:category_id/sub-categories')
export class SubCategoryController {

    constructor(
        private readonly subCategoryService: SubCategoryService
    ) {}

    @Get()
    async findMany(
        @Param('category_id') categoryId: string, 
        @Language('en') lang: string
    ) {
        return await this.subCategoryService.findByLocale(categoryId, lang);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.subCategoryService.findById(id);
    }

    @Post()
    async create(
        @Body() body: { category_id: string; translations: { locale: string; name: string }[] },
        @Language('en') lang: string
    ) {
        return await this.subCategoryService.create(body, lang);
    }

    update() {}

    @Delete(':sub_category_id')
    async delete(
        @Param('sub_category_id') subCategoryId: string,
        @Language('en') lang: string,
    ) {
        return await this.subCategoryService.deleteTranslationByLocale(subCategoryId, lang);
    }
}
