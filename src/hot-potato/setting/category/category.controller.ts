import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Language } from 'src/common/decorators/language.decorator';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}


    @Get()
    async findByLocale(@Language('en') lang: string) {
        return await this.categoryService.findByLocale(lang);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.categoryService.findById(id);
    }

    @Post()
    async create(
        @Body() body: { categories: { locale: string; name: string }[] },
        @Language('en') lang: string
    ) {
        return await this.categoryService.create(body.categories, lang);
    }

    @Put(':id')
    updateCategory() {
        return this.categoryService.update();
    }

    @Delete(':id')
    async deleteTranslationByLocale(
        @Param('id') id: string,
        @Language('en') lang: string
    ) {
       return await this.categoryService.deleteTranslationByLocale(id, lang);
    }
}
