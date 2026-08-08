import { Module } from '@nestjs/common';
import { RoomCategoryService } from './room-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCategory } from './entities/room-category.entity';
import { RoomModule } from '../room/room.module';

@Module({
    exports: [RoomCategoryService],
    providers: [RoomCategoryService],
    imports: [TypeOrmModule.forFeature([RoomCategory]), RoomModule]
})
export class RoomCategoryModule {}
