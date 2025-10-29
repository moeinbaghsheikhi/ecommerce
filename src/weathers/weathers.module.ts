import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';
import { WeatherApiService } from './api/weather.api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeathersController],
  providers: [WeathersService, WeatherApiService],
})
export class WeathersModule {}