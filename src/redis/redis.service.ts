import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client : Redis;

    onModuleInit() {
        this.client = new Redis({
            host: 'localhost',
            port: 6379
        })

        this.client.on('connect', () => {
            console.log("Connected to redis✅")
        })
        this.client.on('error', (err) => {
            console.log("Redis Error❌: ", err)
        })
    }

    async set(key: string, value: string, ttl?: number){
        if(ttl) await this.client.set(key, value, 'EX', ttl)
        else await this.client.set(key, value)
    }

    async get(key: string){
        return this.client.get(key);
    }

    async del(key: string){
        await this.client.del(key);
    }

    onModuleDestroy() {
        this.client.quit();
    }
}
