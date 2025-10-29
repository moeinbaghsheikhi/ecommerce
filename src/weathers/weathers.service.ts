import { Inject, Injectable } from '@nestjs/common';
import { WeatherApiService } from './api/weather.api.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WeathersService {
   constructor(
    private readonly weatherApiService: WeatherApiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisService
  ) {}

  async getWeather(city?: string) {
    const time_minute = 10
    const cachedData: string = await this.redisService.get(`weather:city:${city}`)
    if(cachedData){
      console.log('call data from redis...')
      return JSON.parse(cachedData)
    }

    const result = await this.weatherApiService.getCityDataV2(city);
    await this.redisService.set(`weather:city:${city}`, JSON.stringify(result), (30))
    
    console.log('call API..')
    return result
  }
}