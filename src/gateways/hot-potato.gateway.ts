// hot-potato.gateway.ts
import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Player {
  id: string;
  name: string;
}

interface GameRoom {
  pin: string;
  adminId: string;
  players: Player[];
  activePlayerIndex: number;
  currentWord: string;
  category: string;
  isActive: boolean;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'], // 👈 آدرس دقیق فرانت‌اند شما
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'], // 👈 هماهنگ با فرانت‌اند
})
export class HotPotatoGateway {
  @WebSocketServer() server: Server | undefined;
  
  // ذخیره موقت اتاق‌ها در حافظه سرور
  private rooms: Map<string, GameRoom> = new Map();

  // ۱. ساخت اتاق توسط ادمین
  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { category: string }) {
    const pin = Math.floor(1000 + Math.random() * 9000).toString(); // تولید پین کد ۴ رقمی
    
    const newRoom: GameRoom = {
      pin,
      adminId: client.id,
      players: [],
      activePlayerIndex: 0,
      currentWord: '',
      category: data.category,
      isActive: false
    };
    
    this.rooms.set(pin, newRoom);
    client.join(pin); // اضافه کردن ادمین به رومِ ساکت
    client.emit('roomCreated', { pin });
  }

  // ۲. ورود بازیکنان با پین کد
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { pin: string; name: string }
  ) {
    const room = this.rooms.get(data.pin);
    if (!room) {
      client.emit('error', 'اتاقی با این پین کد یافت نشد!');
      return;
    }

    const newPlayer: Player = { id: client.id, name: data.name };
    room.players.push(newPlayer);
    client.join(data.pin);

    // باخبر کردن همه اعضای اتاق از آمدن بازیکن جدید
    this.server?.to(data.pin).emit('roomUpdated', room);
  }

  // ۳. شروع بازی و مدیریت نوبت‌ها
  @SubscribeMessage('nextTurn')
  handleNextTurn(@ConnectedSocket() client: Socket, @MessageBody() data: { pin: string }) {
    const room = this.rooms.get(data.pin);
    if (!room || !room.isActive) return;

    // بررسی اینکه فقط بازیکن فعال بتواند دکمه نوبت بعد را بزند
    const currentPlayer = room.players[room.activePlayerIndex];
    if (currentPlayer.id !== client.id) return;

    // تغییر نوبت به نفر بعدی
    room.activePlayerIndex = (room.activePlayerIndex + 1) % room.players.length;
    room.currentWord = this.getRandomWord(room.category);

    // فرستادن وضعیت جدید به همه گوشی‌ها
    this.server?.to(data.pin).emit('gameStateChanged', room);
  }

  private getRandomWord(category: string): string {
    // منطق انتخاب کلمه تصادفی از دیتابیس کلمات شما
    return "یک کلمه تصادفی"; 
  }
}