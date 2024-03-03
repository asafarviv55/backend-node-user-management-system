import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestLoggingMiddleware } from './middleware/request-loggin.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestLoggingMiddleware); 
  await app.listen(3001);
}
bootstrap();