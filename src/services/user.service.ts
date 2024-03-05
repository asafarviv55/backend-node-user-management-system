import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client'; // Import PrismaClient and User from '@prisma/client'

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient; // Declare PrismaClient as a private property

  constructor() {
    this.prisma = new PrismaClient(); // Instantiate PrismaClient in the constructor
  }

  async createUser(user1: User): Promise<User> {
    // Hash the password before saving it to the database
    const hashedPassword = this.encodeBase64(user1.password);

    try {
      return await this.prisma.user.create({
        data: {
          email: user1.email,
          username: user1.username,
          roleId: user1.roleId,
          password: hashedPassword
        },
      });
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new Error('Failed to retrieve users');
    }
  }


  async findUnique(email1 : string): Promise<User> {
    try {
      return await this.prisma.user.findUnique({where : {email: email1}});
    } catch (error) {
      throw new Error('Failed to retrieve users');
    }
  }
  

  async findUserByEmail(email: string): Promise<number  | null> {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    return user ? 1 : null;
  }


  async checkUsersExistence(condition: any): Promise<{ exists: boolean; count: number }> {
    try {
      const count = await this.prisma.user.count({
        where: condition,
      });
      return { exists: count > 0, count };
    } catch (error) {
      
      throw new Error('Failed to check users existence');
    }
  }



  // Method to decode base64-encoded strings
  decodeBase64(base64String: string): string {
    return Buffer.from(base64String, 'base64').toString('utf-8');
  }

  private encodeBase64(value: string): string {
    return Buffer.from(value).toString('base64');
  }



}