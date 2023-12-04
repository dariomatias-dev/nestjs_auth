import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    const errorMessage = exception.meta?.cause ?? exception.message;

    exception.code == 'p2025'
      ? reply.status(404).send({
          statusCode: 404,
          errorMessage,
        })
      : reply.status(500).send({
          statusCode: 500,
          errorMessage,
        });
  }
}
