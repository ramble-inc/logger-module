import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingInterceptorOption, MetaData } from '@/logger/logger.interface';
import { LoggerService } from '@/logger/logger.service';

/**
 * Default option for LoggingInterceptor
 */
export const DEFAULT_LOGGING_INTERCEPTOR_OPTION = {
  logOutgoingMessage: false,
};

/**
 * Interceptor to output access log
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private logger: LoggerService,
    private option: LoggingInterceptorOption = DEFAULT_LOGGING_INTERCEPTOR_OPTION,
  ) {
    this.option = {
      ...DEFAULT_LOGGING_INTERCEPTOR_OPTION,
      ...option,
    };
  }

  intercept(
    ctx: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const context = `${ctx.getClass().name}.${ctx.getHandler().name}`;
    const rpcArgumentsHost = ctx.switchToRpc();
    const data = rpcArgumentsHost.getData<Record<string, unknown>>();
    const userAgent = rpcArgumentsHost.getContext<MetaData>()._internal_repr[
      'user-agent'
    ];

    this.logger.info(
      {
        userAgent,
        data,
      },
      context,
    );

    if (this.option.logOutgoingMessage) {
      return next.handle().pipe(
        tap((message: Record<string, unknown>) => {
          this.logger.info(message, context);
        }),
      );
    }
    return next.handle();
  }
}
