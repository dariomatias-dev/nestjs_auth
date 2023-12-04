import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { TokenType } from 'src/enums/token-type.enum';

import { UserFromJwt } from './models/user-from-jwt';
import { UserRequest } from './models/user-request';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid email ou password');
  }

  async generateTokens(user: UserFromJwt) {
    const access_token = await this._generateToken(
      user,
      TokenType.Access,
      '1d',
    );

    const refresh_token = await this._generateToken(
      user,
      TokenType.Refresh,
      '7d',
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async _generateToken(
    user: UserFromJwt,
    tokenType: TokenType,
    expiresIn: string,
  ): Promise<string> {
    const payload = {
      sub: user.id,
      token_type: tokenType,
      email: user.email,
      roles: user.roles,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: expiresIn,
    });

    return token;
  }

  async verifyToken(context: ExecutionContext, tokenType: TokenType) {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const token = this._extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: UserFromJwt = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (payload.token_type != tokenType) {
        throw new Error();
      }

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new Error();
      }

      request.user = payload;
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  private _extractTokenFromHeader(req: UserRequest): string | undefined {
    const authorization = req.headers.authorization;

    if (!authorization) return undefined;

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
