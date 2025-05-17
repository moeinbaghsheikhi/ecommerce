import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from 'src/ip-tracker/ip-tracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService){}

   async use(req: Request, res: Response, next: () => void) {
     await this.ipTrackerService.test(req.ip);
     next();
   }
}
