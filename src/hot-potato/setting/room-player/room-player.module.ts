import { Module } from '@nestjs/common';
import { RoomPlayerService } from './room-player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomPlayerController } from './room-player.controller';
import { RoomPlayer } from './entities/room-player.entity';
import { RoomModule } from '../room/room.module';

@Module({
  controllers: [RoomPlayerController],
  exports: [RoomPlayerService],
  providers: [RoomPlayerService],
  imports: [TypeOrmModule.forFeature([RoomPlayer]), RoomModule]
})
export class RoomPlayerModule {}
