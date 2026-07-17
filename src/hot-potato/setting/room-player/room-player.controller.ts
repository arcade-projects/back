import { Body, Controller, Post } from '@nestjs/common';
import { RoomPlayerService } from './room-player.service';

@Controller('room/player')
export class RoomPlayerController {

    constructor(
        private readonly roomPlayerService: RoomPlayerService
    ) {}

    @Post()
    async create(@Body() payload: {name: string, pincode: string}) {
        return await this.roomPlayerService.create(payload);
    }
}
