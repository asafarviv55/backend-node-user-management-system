import { Logger, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import  { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggingModule } from './modules/logger/logging.module';
import { JwtService } from '@nestjs/jwt';
import { MorganModule, MorganInterceptor } from "nest-morgan";
import { APP_INTERCEPTOR } from "@nestjs/core";



@Module({
  imports: [LoggingModule,MorganModule], 
  controllers: [UserController, AuthController], // Registering controllers
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
    Logger,AuthService,UserService, PrismaService,JwtService], // Registering services
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  
}