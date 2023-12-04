import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { JwtGuard } from './auth/guards/jwt.guard';

@Module({
  imports: [UserModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
