import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginGuard } from './guards/login/login.guard';

import { UserRequest } from './models/user-request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  login(@Req() req: UserRequest) {
    return this.authService.generateTokens();
  }

  @Get('refresh')
  refresh() {
    return this.authService.generateTokens();
  }
}
