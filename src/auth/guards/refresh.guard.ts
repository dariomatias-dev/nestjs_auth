import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserFromJwt } from '../models/user-from-jwt';
import { UserRequest } from '../models/user-request';

import { TokenType } from 'src/enums/token-type.enum';

import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const token = this._extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: UserFromJwt = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (payload.token_type != TokenType.Refresh) {
        throw new Error();
      }

      const user = this.userService.findByEmail(payload.email);

      if (!user) {
        throw new Error();
      }

      request.user = payload;
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }

  private _extractTokenFromHeader(req: UserRequest): string | undefined {
    const authorization = req.headers.authorization;

    if (!authorization) return undefined;

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
