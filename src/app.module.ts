import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SubCategoryService } from './hot-potato/setting/sub_category/sub_category.service';
import { SubCategoryController } from './hot-potato/setting/sub_category/sub_category.controller';
import { HotPotatoController } from './hot-potato/hot-potato.controller';
import { HotPotatoModule } from './hot-potato/hot-potato.module';
import { CategoryModule } from './hot-potato/setting/category/category.module';
import { SubCategoryModule } from './hot-potato/setting/sub_category/sub_category.module';
import { RoomModule } from './hot-potato/setting/room/room.module';
import { RoomPlayerModule } from './hot-potato/setting/room-player/room-player.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          autoLoadEntities: configService.get<boolean>('DATABASE_MIGRATIONS_RUN'),
          synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
        }),
    }),
    RoomPlayerModule,
    RoomModule,
    CategoryModule,
    SubCategoryModule,
    HotPotatoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
