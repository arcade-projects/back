import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SubCategoryService } from './setting/sub_category/sub_category.service';
import { RoomService } from './setting/room/room.service';
import { RoomPlayerService } from './setting/room-player/room-player.service';
import { RoomCategoryService } from './setting/room-category/room-category.service';

interface RoomState {
  room: any;
  roomPlayers: Array<{ id: string; name: string }>;
  subCategoryTitles: string[];
  currentSubCategoryIndex: number;
  currentPlayerIndex: number;
  timerInterval?: NodeJS.Timeout;
  timeLeft: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  }
})
export class HotPotatoGateway {

  private roomsState = new Map<string, RoomState>();

  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly roomService: RoomService,
    private readonly roomPlayerService: RoomPlayerService,
    private readonly roomCategoryService: RoomCategoryService
  ) {}

  @WebSocketServer()
  server!: Server;

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  @SubscribeMessage('pingServer')
  handlePing(@MessageBody() data: any) {
    return { status: 'ok', data };
  }

  @SubscribeMessage('start')
  async handleMessage(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);

    let state = this.roomsState.get(roomId);

    const roomPlayers = await this.roomPlayerService.findByRoomId(roomId);
    const roomCategories = await this.roomCategoryService.findByRoomId(roomId);
    const categoryIds = roomCategories.map(rc => rc.category_id);

    if (!state) {
      const room = await this.roomService.findById(roomId);
      if (!room) return;

      if (!roomPlayers || roomPlayers.length === 0) return;

      const subCategories = await this.subCategoryService.findNamesByLocale(categoryIds, room.locale);

      console.log(subCategories);
      const subCategoryTitles = subCategories.map((sc: any) => sc.title || sc);

      state = {
        room,
        roomPlayers,
        subCategoryTitles: subCategoryTitles.length > 0 ? subCategoryTitles : ['موضوع عمومی'],
        currentSubCategoryIndex: 0,
        currentPlayerIndex: 0,
        timeLeft: (room.minutes || 1) * 60,
      };

      this.roomsState.set(roomId, state);
    } else {
      state.roomPlayers = roomPlayers;
    }

    const nextPlayerObj = state.roomPlayers[state.currentPlayerIndex];

    this.server.to(roomId).emit('start', {
      subCategoryTitle: state.subCategoryTitles[state.currentSubCategoryIndex],
      nextPlayerId: nextPlayerObj.id,
      nextPlayerName: nextPlayerObj.name,
      players: state.roomPlayers.map(p => p.name),
      formattedTime: this.formatTime(state.timeLeft),
      totalTimeSeconds: state.room.minutes * 60
    });
  }

  @SubscribeMessage('timer')
  handleStartTimer(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    const state = this.roomsState.get(roomId);
    if (!state) return;

    const totalSeconds = (state.room?.minutes || 1) * 60;

    client.emit('timerUpdate', {
      formattedTime: this.formatTime(state.timeLeft),
      timeLeftSeconds: state.timeLeft,
      totalTimeSeconds: totalSeconds,
    });

    if (state.timerInterval) return;

    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      
      this.server.to(roomId).emit('timerUpdate', {
        formattedTime: this.formatTime(state.timeLeft),
        timeLeftSeconds: state.timeLeft,
        totalTimeSeconds: totalSeconds,
      });
      
      if (state.timeLeft <= 0) {
        if (state.timerInterval) {
          clearInterval(state.timerInterval);
        }
        this.server.to(roomId).emit('finish', { end: true });
        this.roomsState.delete(roomId);
      }
    }, 1000);
  }

  @SubscribeMessage('playerTurn')
  handlePlayerTurn(@MessageBody() roomId: string) {
    const state = this.roomsState.get(roomId);
    if (!state || state.roomPlayers.length === 0) return { status: 'error', message: 'Room not started' };

    state.currentSubCategoryIndex = (state.currentSubCategoryIndex + 1) % state.subCategoryTitles.length;
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.roomPlayers.length;

    const nextPlayerObj = state.roomPlayers[state.currentPlayerIndex];

    this.server.to(roomId).emit('updateTurn', {
      nextPlayerId: nextPlayerObj.id,
      nextPlayerName: nextPlayerObj.name,
      subCategoryTitle: state.subCategoryTitles[state.currentSubCategoryIndex]
    });

    return {
      status: 'success',
      currentPlayerIndex: state.currentPlayerIndex,
      nextPlayerId: nextPlayerObj.id
    };
  }

  @SubscribeMessage('refreshGame')
  async handleRefreshGame(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    const existingState = this.roomsState.get(roomId);
    if (existingState?.timerInterval) {
      clearInterval(existingState.timerInterval);
    }
    this.roomsState.delete(roomId);

    await this.handleMessage(roomId, client);
    this.handleStartTimer(roomId, client);
  }
}