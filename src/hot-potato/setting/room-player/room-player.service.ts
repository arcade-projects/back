import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomPlayer } from './entities/room-player.entity';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';

@Injectable()
export class RoomPlayerService {

    constructor(
        @InjectRepository(RoomPlayer)
        private roomPlayerRepository: Repository<RoomPlayer>,
        private roomService: RoomService

    ) {}

    async findByRoomId(roomId: string) {
        return await this.roomPlayerRepository
            .createQueryBuilder('rp')
            .select('rp.id', 'id')
            .addSelect('rp.player_name', 'name')
            .where('rp.room_id = :roomId', {roomId})
            .getRawMany();
    }
    
    async create(payload: any) {

        const room = await this.roomService.findByPincode(payload.pincode);

        const data = {
            player_name: payload.name,
            room_id: room?.id
        }

        const roomPlayer = this.roomPlayerRepository.create(data);
        return this.roomPlayerRepository.save(roomPlayer);
    }
}
