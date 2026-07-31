import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {

    private readonly logger = new Logger(RedisService.name);
    public readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        const host = this.configService.get<string>('REDIS_HOST') || 'redis';
        const port = Number(this.configService.get<number>('REDIS_PORT')) || 6379;
        this.client = new Redis({
            host,
            port,
            family: 4,
            enableOfflineQueue: false,
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 5) {
                    return null;
                }
                return Math.min(times * 200, 1000);
            }
        });

        this.client.on('ready', () => {
            this.logger.log(`✅ Redis client successfully connected to ${host}:${port}`)
        })

        this.client.on('error', (error) => {
            console.log('[Redis Client Error]:', error.message);
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }
}
