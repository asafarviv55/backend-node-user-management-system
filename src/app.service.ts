/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  login(email: string, password: string): string {
    // Replace this with your actual authentication logic
    if (email === 'user@example.com' && password === 'password') {
      return 'Login successful';
    } else {
      throw new Error('Invalid email or password');
    }
  }
}