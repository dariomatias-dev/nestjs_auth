import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRequest } from '../models/user-request';

import { Role } from 'src/enums/role.enum';

@Injectable()
export class TokenIdMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequest>();

    if (request.user.roles.includes(Role.Admin)) return true;

    if (request.user.id != request.params['id']) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
