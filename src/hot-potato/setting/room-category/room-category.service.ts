import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomCategory } from './entities/room-category.entity';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';
import { RoomCategoryDto } from './dto/room-category.dto';

@Injectable()
export class RoomCategoryService {

    constructor(
        @InjectRepository(RoomCategory)
        private roomCategoryRepository: Repository<RoomCategory>,
        private roomService: RoomService
    ) {}

    async findByRoomId(roomId: string) {
        return await this.roomCategoryRepository
            .createQueryBuilder('rc')
            .select('rc.category_id', 'category_id')
            .where('rc.room_id = :roomId', {roomId})
            .getRawMany();
    }

    async create(payload: RoomCategoryDto)
    {
        const data = payload.category_ids.map((id) => ({
            room_id: payload.room_id,
            category_id: id,
        }));

        const roomPlayer = this.roomCategoryRepository.create(data);
        return this.roomCategoryRepository.save(roomPlayer);
    }
}
