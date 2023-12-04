import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

import { PrismaNotFoundExceptionFilter } from './exception-filters/prisma-not-found.exception-filter';
import { UniqueFieldExceptionFilter } from './exception-filters/unique-field.exception-filter';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new PrismaNotFoundExceptionFilter(),
    new UniqueFieldExceptionFilter(),
  );

  const userService = app.get(UserService);

  const email = process.env.ADMIN_EMAIL;
  const user = await userService.findByEmail(email);

  if (!user) {
    const password = process.env.ADMIN_PASSWORD;
    const data: CreateUserDto = {
      name: 'Administrator',
      age: 20,
      email,
      password,
    };

    await userService.createAdmin(data);
  }

  await app.listen(3001);
}
bootstrap();
