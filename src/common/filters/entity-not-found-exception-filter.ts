import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundException } from '../exceptions/entity-not-found-exception';
import { Response } from 'express';

@Catch(EntityNotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(exception.statusCode).json({
      success: false,
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
      message: exception.message,
      details: {
        modelName: exception.modelName,
        fields: exception.fields,
      },
    });
  }
}
