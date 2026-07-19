import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SubCategoryService } from './setting/sub_category/sub_category.service';
import { RoomService } from './setting/room/room.service';
import { clearInterval } from 'timers';
import { RoomPlayerService } from './setting/room-player/room-player.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  }
})
export class HotPotatoGateway {

  private room: any;
  private players: any;
  private subCategoryTitles: any;
  private currentSubCategoryIndex: number = 0;
  private currentPlayerIndex: number = 0;

  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly roomService: RoomService,
    private readonly roomPlayerService: RoomPlayerService
  ) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('start')
  async handleMessage(@MessageBody() data: string) {
    
    this.room = await this.roomService.findById(data);

    const roomPlayers = await this.roomPlayerService.findByRoomId(this.room.id);
    const subCategories = await this.subCategoryService.findByCategoryId(this.room.category_id);

    this.subCategoryTitles = subCategories.map((subCategory) => {
      return subCategory.title;
    });

    this.players = roomPlayers.map((roomPlayer) => {
      return {
        id: roomPlayer.id,
        name: roomPlayer.player_name,
      };
    });
    
    const nextSubCategoryTitleObj = this.subCategoryTitles[this.currentSubCategoryIndex];

    const nextPlayerObj = this.players[this.currentPlayerIndex];

    const nextPlayerId = nextPlayerObj.id;
    const nextPlayerName = nextPlayerObj.name;

    this.server.emit('start',
      {
        subCategoryTitle: nextSubCategoryTitleObj,
        nextPlayerId: nextPlayerId,
        nextPlayerName: nextPlayerName,
        players: this.players.map(player => player.name),
        minutes: this.room.minutes * 60,
      }
    )
  }

  private timerInterval: NodeJS.Timeout | null = null;

  @SubscribeMessage('timer')
  handleStartTimer() {
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    let timeLeft = this.room.minutes * 60;

    this.server.emit('timerUpdate', timeLeft);
    this.timerInterval = setInterval(() => {
      timeLeft--;
      this.server.emit('timerUpdate', timeLeft);

      if (timeLeft <= 0) {

        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.server.emit('finish', {
          end: true
        });
      }
    }, 1000);
  }

  @SubscribeMessage('playerTurn')
  handlePlayerTurn(@MessageBody() data: string) {
    
    this.currentSubCategoryIndex = (this.currentSubCategoryIndex + 1) % this.subCategoryTitles.length;
    const nextSubCategoryTitleObj = this.subCategoryTitles[this.currentSubCategoryIndex];

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    const nextPlayerObj = this.players[this.currentPlayerIndex];

    const nextPlayerId = nextPlayerObj.id;
    const nextPlayerName = nextPlayerObj.name;

    this.server.emit('updateTurn',
      {
        nextPlayerId: nextPlayerId,
        nextPlayerName: nextPlayerName,
        subCategoryTitle: nextSubCategoryTitleObj
      }
    )

    return {
      status: 'success',
      currentPlayerIndex: this.currentPlayerIndex,
      nextPlayerId: nextPlayerId
    };
  }
}
