import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      typeof (exception as { statusCode: unknown }).statusCode === 'number'
    ) {
      status = (exception as { statusCode: number }).statusCode;
    }

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'message' in exception &&
      typeof (exception as { message: unknown }).message === 'string'
    ) {
      message = (exception as { message: string }).message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
