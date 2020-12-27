import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import type { Logger } from 'winston';
import {
  DEFAULT_CONTEXT,
  IS_OBJECT_SYMBOL,
  WINSTON_LOGGER,
} from '@/logger/logger.constants';
import type { WinstonMetadata } from '@/logger/logger.interface';
import { getStackTrace } from '@/logger/logger.util';

@Injectable()
export class LoggerService implements NestLoggerService {
  private meta: WinstonMetadata;

  constructor(@Inject(WINSTON_LOGGER) private logger: Logger) {
    this.meta = {
      context: DEFAULT_CONTEXT,
    };
  }

  /**
   * Generic log method
   *
   * @param name
   * @param message
   * @param context
   */
  private callFunction(
    level: string,
    message: string | Record<string, unknown>,
    meta: Record<string, unknown>,
  ): void {
    if (this.logger[level] == null) {
      throw new Error(`logger.${level} is not implemented`);
    }

    const context = meta.context || this.meta.context || DEFAULT_CONTEXT;
    if (typeof message === 'string') {
      this.logger.log(level, message, {
        ...this.meta,
        ...meta,
        context,
        [IS_OBJECT_SYMBOL]: false,
      });
    } else if (typeof message === 'object') {
      this.logger.log(level, {
        ...message,
        ...this.meta,
        ...meta,
        context,
        [IS_OBJECT_SYMBOL]: true,
      });
    }
  }

  /**
   * Output log log
   * Alias to info log
   *
   * @param message
   * @param context
   */
  public log(message: string, context?: string): void;
  public log(message: Record<string, unknown>, context?: string): void;
  public log(
    message: string | Record<string, unknown>,
    context?: string,
  ): void {
    this.callFunction('info', message, { context });
  }

  /**
   * Output info log
   *
   * @param message
   * @param context
   */
  public info(message: string, context?: string): void;
  public info(message: Record<string, unknown>, context?: string): void;
  public info(
    message: string | Record<string, unknown>,
    context?: string,
  ): void {
    this.callFunction('info', message, { context });
  }

  /**
   * Output warn log
   *
   * @param message
   * @param trace
   * @param context
   */
  public error(message: string, trace?: string, context?: string): void;
  public error(
    message: Record<string, unknown>,
    trace?: string,
    context?: string,
  ): void;
  public error(message: Error, context?: string): void;
  public error(
    message: string | Error | Record<string, unknown>,
    traceOrContext?: string,
    context?: string,
  ): void {
    if (message instanceof Error) {
      this.callFunction('error', message.toString(), {
        context: traceOrContext,
        stack: getStackTrace(message.stack),
      });
    } else {
      this.callFunction('error', message, { context, stack: traceOrContext });
    }
  }

  /**
   * Output warn log
   *
   * @param message
   * @param context
   */
  public warn(message: string, context?: string): void;
  public warn(message: Record<string, unknown>, context?: string): void;
  public warn(
    message: string | Record<string, unknown>,
    context?: string,
  ): void {
    this.callFunction('warn', message, { context });
  }

  /**
   * Output debug log
   *
   * @param message
   * @param context
   */
  public debug(message: string, context?: string): void;
  public debug(message: Record<string, unknown>, context?: string): void;
  public debug(
    message: string | Record<string, unknown>,
    context?: string,
  ): void {
    this.callFunction('debug', message, { context });
  }

  /**
   * Output verbose log
   *
   * @param message
   * @param context
   */
  public verbose(message: string, context?: string): void;
  public verbose(message: Record<string, unknown>, context?: string): void;
  public verbose(
    message: string | Record<string, unknown>,
    context?: string,
  ): void {
    this.callFunction('verbose', message, { context });
  }

  /**
   * Create child logger
   *
   * @param meta
   */
  public child(meta: WinstonMetadata): LoggerService {
    const childLogger = new LoggerService(this.logger.child(meta));
    childLogger.setMetadata(meta);

    return childLogger;
  }

  /**
   * Setter for metadata
   *
   * @param meta
   */
  public setMetadata(meta: WinstonMetadata): void {
    this.meta = meta;
  }

  /**
   * Getter for metadata
   *
   * @param meta
   */
  public getMetadata(): WinstonMetadata {
    return this.meta;
  }

  /**
   * Set context
   *
   * @param context
   */
  public setContext(context: string): void {
    this.meta.context = context;
  }

  /**
   * Return winston instance
   */
  public getInstance(): Logger {
    return this.logger;
  }
}
