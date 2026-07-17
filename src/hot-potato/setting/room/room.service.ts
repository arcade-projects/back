import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {

    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) {}

    findById(id: string) {
        return this.roomRepository.findOneBy({ id })
    }

    findByPincode(pincode: string) {
        return this.roomRepository.findOneBy({ pincode })
    }

    create(payload: any) {
        const room = this.roomRepository.create({
            minutes: payload.minutes,
            category_id: payload.category_id,
            pincode: Math.floor(100000 + Math.random() * 900000).toString(),
        }
);
        return this.roomRepository.save(room);
    }
}
