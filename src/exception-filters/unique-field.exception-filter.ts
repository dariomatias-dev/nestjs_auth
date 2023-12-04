import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class UniqueFieldExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    const fieldName = exception.meta?.target;

    const errorMessage =
      `Value the of ${fieldName} field already exists` ?? exception.message;

    exception.code == 'P2002'
      ? reply.status(409).send({
          statusCode: 409,
          errorMessage,
        })
      : reply.status(409).send({
          statusCode: 409,
          errorMessage,
        });
  }
}
