import { Module } from '@nestjs/common';
import { CategoryTranslationService } from './category-translation.service';
import { CategoryTranslationController } from './category-translation.controller';

@Module({
  exports: [CategoryTranslationService],
  providers: [CategoryTranslationService],
  controllers: [CategoryTranslationController]
})
export class CategoryTranslationModule {}
