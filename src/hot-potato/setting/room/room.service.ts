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

    async findMany() {
        return await this.roomRepository.createQueryBuilder('r')
            .select('r.id', 'id')
            .select('r.pincode', 'pincode')
            .addSelect('r.category_id', 'category_id')
            .addSelect('r.minutes', 'minutes')
            .addSelect('r.status', 'status')
            .addSelect('r.activate', 'activate')
            .getRawMany();
    }

    findById(id: string) {
        return this.roomRepository.findOneBy({ id })
    }

    findByPincode(pincode: string) {
        return this.roomRepository.findOneBy({ pincode })
    }

    create(payload: any) {

        console.log(payload)
        const room = this.roomRepository.create({
            minutes: payload.minutes,
            category_id: payload.category_id,
            pincode: Math.floor(100000 + Math.random() * 900000).toString(),
        });
        
        return this.roomRepository.save(room);
    }
}
