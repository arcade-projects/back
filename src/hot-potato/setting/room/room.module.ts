import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';

@Module({
  controllers: [RoomController],
  exports: [RoomService],
  providers: [RoomService],
  imports: [TypeOrmModule.forFeature([Room])]
})
export class RoomModule {}
