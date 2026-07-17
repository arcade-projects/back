    import { Module } from '@nestjs/common';
    import { SubCategoryService } from './sub_category.service';
    import { SubCategoryController } from './sub_category.controller';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { SubCategory } from './entities/sub_category.entity';

    @Module({
        imports: [TypeOrmModule.forFeature([SubCategory])],
        exports: [SubCategoryService],
        controllers: [SubCategoryController],
        providers: [SubCategoryService]
    })
    export class SubCategoryModule {}
