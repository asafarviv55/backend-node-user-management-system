import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace 'your_secret_key' with your actual secret key
      request.user = decoded; // Attach the decoded user to the request object
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}