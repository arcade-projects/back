import { Module } from '@nestjs/common';
import { SubCategoryTranslationController } from './sub-category-translation.controller';
import { SubCategoryTranslationService } from './sub-category-translation.service';

@Module({
  exports: [SubCategoryTranslationService],
  providers: [SubCategoryTranslationService],
  controllers: [SubCategoryTranslationController]
})
export class SubCategoryTranslationModule {}
