    import { Module } from '@nestjs/common';
    import { SubCategoryService } from './sub_category.service';
    import { SubCategoryController } from './sub_category.controller';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { SubCategory } from './entities/sub_category.entity';
import { SubCategoryTranslation } from '../sub-category-translation/entities/sub-category-translation.entity';

    @Module({
        imports: [TypeOrmModule.forFeature([SubCategory, SubCategoryTranslation])],
        exports: [SubCategoryService],
        providers: [SubCategoryService],
        controllers: [SubCategoryController]
    })
    export class SubCategoryModule {}
