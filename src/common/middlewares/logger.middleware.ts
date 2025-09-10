import { Logger } from '@nestjs/common';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const startAt = process.hrtime();
  const { ip, method, originalUrl } = request;
  const userAgent = request.get('user-agent') || '';
  const logger = new Logger();
  response.on('finish', () => {
    const { statusCode } = response;
    const diff = process.hrtime(startAt);
    const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
    const origin = `${method} ${originalUrl} ${statusCode}`;
    if ([200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 304].includes(statusCode)) {
      logger.log(` ⛩  ${origin} ${responseTime}ms - ${userAgent} ${ip} - ${JSON.stringify(request.body)}`);
    } else {
      logger.log(`⛩  ${chalk.red(origin)} ${responseTime}ms - ${userAgent} ${ip} - ${JSON.stringify(request.body)}`);
    }
  });
  next();
};
