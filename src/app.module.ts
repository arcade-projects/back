import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HotPotatoModule } from './hot-potato/hot-potato.module';
import { CategoryModule } from './hot-potato/setting/category/category.module';
import { SubCategoryModule } from './hot-potato/setting/sub_category/sub_category.module';
import { RoomModule } from './hot-potato/setting/room/room.module';
import { RoomPlayerModule } from './hot-potato/setting/room-player/room-player.module';
import { HeaderResolver, CookieResolver, I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from '@nestjs-modules/mailer';
import path from 'path';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        }
      },
      defaults: {
        from: `"Arcade" <${process.env.GMAIL_USER}>`
      }
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'dist', 'i18n'),
        watch: process.env.NODE_ENV !== 'production',
      },
      resolvers: [
        new CookieResolver(['lang', 'NEXT_LOCALE']),
        new HeaderResolver(['x-customer-lang']),
        new AcceptLanguageResolver(),
      ]
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
    UserModule,
    AuthModule,
    RedisModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
