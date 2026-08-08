import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';
import { RoomCategory } from '../room-category/entities/room-category.entity';
import { RoomCategoryService } from '../room-category/room-category.service';

@Module({
  controllers: [RoomController],
  exports: [RoomService],
  providers: [RoomService, RoomCategoryService],
  imports: [TypeOrmModule.forFeature([Room, RoomCategory])]
})
export class RoomModule {}
