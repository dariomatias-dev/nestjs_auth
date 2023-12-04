import { Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login() {
    return this.authService.generateTokens();
  }

  @Get()
  refresh() {
    return this.authService.generateTokens();
  }
}
