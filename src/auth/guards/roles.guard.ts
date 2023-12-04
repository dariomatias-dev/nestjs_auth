import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Role } from 'src/enums/role.enum';

import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRequest } from '../models/user-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<UserRequest>();

    const userRoles = request.user.roles;

    if (userRoles.includes(Role.Admin)) return true;

    const authorized = roles.some((role) => {
      return userRoles.includes(role);
    });

    if (!authorized) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
