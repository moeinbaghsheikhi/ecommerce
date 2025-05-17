import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class BodyLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    const body = req.body;

    if(Object.keys(body).length === 0) {
      return res.status(400).send({ statusCode: 400, message: "Your Request dont have body!" })
    }
    console.log(body);
    next();
  }
}
