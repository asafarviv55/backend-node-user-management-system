import { Controller, Post,Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {  User } from '@prisma/client'; 


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() user: User): Promise<string | { message: string }> {
    try {
      const token = await this.authService.signup(user);
      return token;
    } catch (error:any) {
      console.log(error);
      return { message: error.message };
    }
  }


  @Get('/hello')
  async hello(): Promise<string>{
    return "Hello asaf";
  }



  @Post('/login')
  async login(@Body() credentials: { email: string; password: string }): Promise<string | { message: string }> {
    try {
      const token = await this.authService.login(credentials );
      return token;
    } catch (error) {
      return { message: 'Login failed' };
    }
  }


}