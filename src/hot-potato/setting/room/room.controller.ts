import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Language } from 'src/common/decorators/language.decorator';
import { RoomCategoryService } from '../room-category/room-category.service';

@Controller('room')
export class RoomController {

    constructor(
        private readonly roomService: RoomService,
        private readonly roomCategoryService: RoomCategoryService
    ) {}

    @Get()
    findMany() {
        return this.roomService.findMany();
    }

    @Get('/:id')
    getById(@Param('id') id: string) {
        return this.roomService.findById(id); 
    }

    @Get('/pincode/:pincode')
    getByPincode(@Param('pincode') pincode: string) {
        return this.roomService.findByPincode(pincode); 
    }

    @Post()
    async create(@Body() payload: {category_ids: string[], minutes: string}, @Language('en') lang: string) {

        const room = await this.roomService.create(payload, lang);

        await this.roomCategoryService.create({ 
            room_id: room.id, 
            category_ids: payload.category_ids, 
        });

        return {
            'pincode': room.pincode
        };
    }
}
