import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthService } from 'src/auth/auth.service';

import { RequestBodyLogin } from 'src/auth/models/request-body-login';
import { UserRequest } from 'src/auth/models/user-request';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const body = request.body as RequestBodyLogin;

    await this._validateBody(body);

    const user = await this.authService.validateUser(body);

    if (!user) {
      return false;
    }

    request.user = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return true;
  }

  private async _validateBody(body: RequestBodyLogin) {
    const requestBody = plainToClass(RequestBodyLogin, body);
    const errors = await validate(requestBody);

    if (errors.length > 0) {
      const errorMessages = errors.map((err) => {
        return err.constraints;
      });

      const message = errorMessages.reduce((result, errorMessage) => {
        return [...result, ...Object.values(errorMessage)];
      }, []);

      throw new BadRequestException(message);
    }
  }
}
