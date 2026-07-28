import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { HotPotatoModule } from './hot-potato/hot-potato.module';
import { CategoryModule } from './hot-potato/setting/category/category.module';
import { SubCategoryModule } from './hot-potato/setting/sub_category/sub_category.module';
import { RoomModule } from './hot-potato/setting/room/room.module';
import { RoomPlayerModule } from './hot-potato/setting/room-player/room-player.module';
import { HeaderResolver, CookieResolver, I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        new CookieResolver(['lang', 'NEXT_LOCALE']),
        new HeaderResolver(['x-customer-lang']),
        new AcceptLanguageResolver(),
      ]
    }),
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
          synchronize: configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
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
