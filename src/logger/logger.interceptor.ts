import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WinstonLogger } from 'nest-winston';
import { createLogger, LoggerOptions } from 'winston';
import { MetaData } from './logger.interface';

/**
 * Interceptor to output access log.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: WinstonLogger;

  constructor(option: LoggerOptions) {
    this.logger = new WinstonLogger(createLogger(option));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controller = context.getClass().name;
    const method = context.getHandler().name;
    const data = context.getArgByIndex<Record<string, unknown>>(0);
    // eslint-disable-next-line no-underscore-dangle
    const userAgent = context.getArgByIndex<MetaData>(1)._internal_repr[
      'user-agent'
    ];

    this.logger.log(
      {
        userAgent,
        data,
      },
      `${controller}.${method}`,
    );

    return next.handle();
  }
}
