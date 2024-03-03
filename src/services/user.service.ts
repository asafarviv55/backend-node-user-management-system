import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client'; // Import PrismaClient and User from '@prisma/client'

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient; // Declare PrismaClient as a private property

  constructor() {
    this.prisma = new PrismaClient(); // Instantiate PrismaClient in the constructor
  }

  async createUser(user: User): Promise<User> {
    // Hash the password before saving it to the database
    const hashedPassword = this.decodeBase64(user.password);

    try {
      return await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
    } catch (error) {
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

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new Error('Failed to find user by email');
    }
  }

  // Method to decode base64-encoded strings
  decodeBase64(base64String: string): string {
    return Buffer.from(base64String, 'base64').toString('utf-8');
  }
}