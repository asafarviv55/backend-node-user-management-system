import { PrismaClient } from '@prisma/client';

export class PrismaService {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}