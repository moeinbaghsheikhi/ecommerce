import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get(':city')
  async create(@Param('city') city: string) {
    return await this.weathersService.getWeather(city);
  }
}
