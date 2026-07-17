import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {

    constructor(
        private readonly roomService: RoomService
    ) {}

    @Get('/:id')
    getById(@Param('id') id: string) {
        return this.roomService.findById(id); 
    }

    @Post()
    async create(@Body() payload: {category_id: string, minutes: string}) {

        return await this.roomService.create(payload);
    }
}
