import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginGuard } from './guards/login.guard';
import { RefreshGuard } from './guards/refresh.guard';

import { UserRequest } from './models/user-request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  login(@Req() req: UserRequest) {
    return this.authService.generateTokens(req.user);
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  refresh(@Req() req: UserRequest) {
    return this.authService.generateTokens(req.user);
  }
}
