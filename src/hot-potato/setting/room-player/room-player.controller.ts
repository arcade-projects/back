import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomPlayerService } from './room-player.service';
import { RoomService } from '../room/room.service';

@Controller('room/:pincode/player')
export class RoomPlayerController {

    constructor(
        private readonly roomService: RoomService,
        private readonly roomPlayerService: RoomPlayerService
    ) {}

    @Post()
    async create(@Body() payload: {name: string, pincode: string}) {
        return await this.roomPlayerService.create(payload);
    }

    @Get()
    async getByRoomId(@Param('pincode') pincode: string) {
        const room = await this.roomService.findByPincode(pincode);

        console.log(room);
        return this.roomPlayerService.findByRoomId(room!.id); 
    }
}
