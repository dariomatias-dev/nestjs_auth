import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

import { TokenType } from 'src/enums/token-type.enum';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.authService.verifyToken(context, TokenType.Refresh);

    return true;
  }
}
