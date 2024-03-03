import * as morgan from 'morgan';
import { Request, Response, NextFunction }  from 'express';

export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  morgan('combined')(req, res, next);
}