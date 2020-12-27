import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '@/logger/logger.service';
import { MetaData } from '@/logger/logger.interface';

/**
 * Interceptor to output access log
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const { name: controller } = context.getClass();
    const { name: method } = context.getHandler();

    const rpcArgumentsHost = context.switchToRpc();
    const data = rpcArgumentsHost.getData<Record<string, unknown>>();
    const userAgent = rpcArgumentsHost.getContext<MetaData>()._internal_repr[
      'user-agent'
    ];

    this.logger.info(
      {
        userAgent,
        data,
      },
      `${controller}.${method}`,
    );

    return next.handle();
  }
}
