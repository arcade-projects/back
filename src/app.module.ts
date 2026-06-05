import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

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
    CategoryModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
