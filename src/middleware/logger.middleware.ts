import { Injectable,  NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import { AppLogger } from 'src/modules/logger/app.logger';



@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  
  constructor(private readonly logger: AppLogger) {}
  
  use(req: Request, res: Response, next: NextFunction) {
    const logFormat = '[:date[iso]] :method :url :status :response-time ms';

    morgan(logFormat, {
      stream: {
        write: (str: string) => {
          this.logger.log(str.trim());
        },
      },
    })(req, res, next);
  
  }
}