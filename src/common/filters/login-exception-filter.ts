import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LoginException } from '../exceptions/login-exception';
import { Response } from 'express';

@Catch(LoginException)
export class LoginExceptionFilter implements ExceptionFilter {
  catch(exception: LoginException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 401;
    const message = exception.message;
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      details: {},
    });
  }
}
