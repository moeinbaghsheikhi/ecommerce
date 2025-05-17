import { Injectable, Ip, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from 'src/ip-tracker/ip-tracker.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
  }
}