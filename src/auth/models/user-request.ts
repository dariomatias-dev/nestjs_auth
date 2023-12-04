import { FastifyRequest } from 'fastify';

import { UserFromJwt } from './user-from-jwt';

export interface UserRequest extends FastifyRequest {
  user: UserFromJwt;
}
