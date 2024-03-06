import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Import the JwtAuthGuard


@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: User) {
    try {
      const newUser = await this.userService.createUser(user);
      return { success: true, user: newUser };
    } catch (error) {
      // Handle service errors
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAllUsers() {
    try {
      const users = await this.userService.findAllUsers();
      return { success: true, users };
    } catch (error) {
      // Handle service errors
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}

 
