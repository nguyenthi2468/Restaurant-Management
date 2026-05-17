import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return { data: null };
        }

        if (typeof data !== 'object') {
          return { data };
        }

        if (
          'accessToken' in data ||
          ('data' in data && 'meta' in data) ||
          Array.isArray(data)
        ) {
          return data;
        }

        if ('message' in data && Object.keys(data).length === 1) {
          return data;
        }

        return { data };
      }),
    );
  }
}
