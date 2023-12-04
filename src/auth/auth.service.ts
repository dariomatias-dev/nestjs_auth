import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RequestBodyLogin } from './models/request-body-login';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser({ email, password }: RequestBodyLogin) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid email ou password');
  }

  async generateTokens() {
    return 'oi';
  }
}
