import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherApiService {
  private readonly baseUrlV1 = 'http://api.waqi.info/feed';
  private readonly baseUrlV2 = 'https://one-api.ir/weather';

  constructor(private readonly httpService: HttpService) {}

  async getCityDataV1(city: string = 'tehran') {
    const url = `${this.baseUrlV1}/${city}/?token=demo`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      // استخراج دما از JSON
      const temperature = data?.data?.iaqi?.t?.v ?? null;

      return {
        city: data?.data?.city?.name,
        temperature,
        dominantPollutant: data?.data?.dominentpol,
        time: data?.data?.time?.s,
      };
    } catch (error) {
      console.error('Error fetching air quality data:', error.message);
      throw new Error('Failed to fetch air quality data');
    }
  }

  async getCityDataV2(city: string = 'tehran'){
    let location = this.getCityLoc(city)
    const url = `${this.baseUrlV2}/?token=277542:67442f8616368&action=currentbylocation&lat=${location.lat}&lon=${location.long}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

       return data.result;
    } catch (error) {
      console.error('Error fetching air quality data:', error.message);
      throw new Error('Failed to fetch air quality data');
    }
  }

  private getCityLoc(city: string){
    if(city == 'kashan'){
      return {
        lat: 33.982567,
        long: 51.440891
      }
    }else if(city == 'tehran'){ 
      return {
        lat: 35.669247,
        long: 51.390703
      }
    }
  }
}
