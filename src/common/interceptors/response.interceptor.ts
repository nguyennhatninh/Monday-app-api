import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const action = this.getActionFromRequest(request);
    const model = this.getModelFromRequest(request);

    const skip = this.reflector.get<boolean>('skipGlobalInterceptor', context.getHandler());
    if (skip) return next.handle();
    return next.handle().pipe(
      map((data) => ({
        status: 200,
        data,
        message: `${action} ${model} success`
      }))
    );
  }
  private getActionFromRequest(request: Request): string {
    const method = request.method;
    const url = request.url;
    const model = url.split('/')[1];
    if (model === 'auth') return '';
    if (method === 'POST') {
      return 'create';
    } else if (method === 'PATCH') {
      return 'update';
    } else if (method === 'GET') {
      return 'get';
    } else {
      return 'unknown';
    }
  }
  private getModelFromRequest(request: Request): string {
    const url = request.url;
    if (url) {
      const componentUrl = url.split('/');
      let model = componentUrl[1];
      // handle in case url type is like '/user/:id/workspaces'
      const haveMongoId = url.match(/\/[0-9a-fA-F]{24}\b/);
      if (haveMongoId && url.split('/').length === 4) return (model = `${componentUrl[3]} of ${componentUrl[1]}`);
      if (model.includes('auth')) return `action ${componentUrl[2].replace('-', ' ')}`;
      return model;
    } else {
      return 'unknown';
    }
  }
}
