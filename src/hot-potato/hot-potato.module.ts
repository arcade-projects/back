import { Module } from '@nestjs/common';
import { HotPotatoService } from './hot-potato.service';
import { HotPotatoGateway } from './hot-potato.gateway';
import { CategoryController } from './setting/category/category.controller';
import { CategoryModule } from './setting/category/category.module';
import { SubCategoryModule } from './setting/sub_category/sub_category.module';
import { RoomController } from './setting/room/room.controller';
import { RoomModule } from './setting/room/room.module';
import { RoomPlayerModule } from './setting/room-player/room-player.module';
import { CategoryTranslationModule } from './setting/category-translation/category-translation.module';
import { SubCategoryTranslationModule } from './setting/sub-category-translation/sub-category-translation.module';
import { RoomCategoryModule } from './setting/room-category/room-category.module';

@Module({
  providers: [HotPotatoService, HotPotatoGateway],
  controllers: [CategoryController, RoomController],
  imports: [
    CategoryModule,
    CategoryTranslationModule,
    SubCategoryModule, 
    SubCategoryTranslationModule,
    RoomModule, 
    RoomPlayerModule, 
    RoomCategoryModule
  ]
})
export class HotPotatoModule {}
