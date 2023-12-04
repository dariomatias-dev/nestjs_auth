import { FastifyRequest } from 'fastify';

import { UserEntity } from 'src/user/entities/user.entity';

export interface UserRequest extends FastifyRequest {
  user: UserEntity;
}
