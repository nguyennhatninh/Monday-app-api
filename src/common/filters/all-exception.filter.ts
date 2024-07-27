import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private isDev: boolean;
  constructor(config: ConfigService) {
    this.isDev = config.get('NODE_ENV') === 'development';
    this.registerCatchAllExceptionsHook();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = this.getStatus(exception);
    let defaultRes = {};
    let stack: unknown;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) defaultRes = { statusCode: 500, message: 'Something went wrong' };

    if (status === HttpStatus.BAD_REQUEST && exception instanceof Error) {
      defaultRes = { statusCode: 400, message: exception.message };
    }

    if (exception instanceof HttpException) {
      defaultRes = exception.getResponse();
      stack = exception.stack;
    }

    if (this.isDev)
      defaultRes = {
        ...defaultRes,
        error: exception
      };

    if (this.isDev && stack)
      defaultRes = {
        ...defaultRes,
        stack
      };

    response.status(status).json(defaultRes);
  }

  getStatus(exception: unknown) {
    if (exception instanceof HttpException) return exception.getStatus();
    if (exception instanceof Error) return HttpStatus.BAD_REQUEST;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => console.error('UNHANDLED REJECTION', reason));

    process.on('uncaughtException', (reason) => console.error('UNCAUGHT EXCEPTION', reason));
  }
}
