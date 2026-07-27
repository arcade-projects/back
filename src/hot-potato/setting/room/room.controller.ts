import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Language } from 'src/common/decorators/language.decorator';

@Controller('room')
export class RoomController {

    constructor(
        private readonly roomService: RoomService
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
    async create(@Body() payload: {category_id: string, minutes: string}, @Language('en') lang: string) {

        return await this.roomService.create(payload, lang);
    }
}
