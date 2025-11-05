import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Erro de banco de dados desconhecido.';

    switch (exception.code) {
      case 'P2002':
        // Violação de unique constraint
        message = `O valor informado para o campo "${(exception.meta?.target as string[])[0]}" já está em uso.`;
        status = HttpStatus.CONFLICT;
        break;

      case 'P2025':
        // Registro não encontrado
        message = 'O registro solicitado não foi encontrado.';
        status = HttpStatus.NOT_FOUND;
        break;

      case 'P2003':
        // Violação de foreign key
        message =
          'Violação de integridade referencial. Verifique relacionamentos.';
        status = HttpStatus.CONFLICT;
        break;

      case 'P2014':
        message = 'Erro de relacionamento detectado (violação de restrição).';
        status = HttpStatus.BAD_REQUEST;
        break;

      case 'P2033':
        message = 'Valor numérico fora dos limites permitidos.';
        status = HttpStatus.BAD_REQUEST;
        break;

      default:
        message = `Erro Prisma (${exception.code}): ${exception.message}`;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      details: exception.meta,
    });
  }
}
