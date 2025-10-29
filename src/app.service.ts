import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sum(a: any, b: any){
    if(typeof a !== 'number' || typeof b !== 'number') throw new Error('input must to be number')
    return a+b;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
