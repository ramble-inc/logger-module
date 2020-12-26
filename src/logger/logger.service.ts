import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino, { Logger, LoggerOptions } from 'pino';
import { devOption } from '@/logger/logger.constants';
import { LogLevelLabel } from '@/logger/logger.interface';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;

  constructor(option: LoggerOptions = devOption) {
    this.logger = pino(option);
  }

  /**
   * Generic log method
   *
   * @param name
   * @param message
   */
  callFunction(
    name: LogLevelLabel,
    message: string | Record<string, unknown>,
  ): void {
    if (typeof message === 'string') {
      this.logger[name]({ msg: message });
    } else if (typeof message === 'object') {
      const { stack, ...rest } = message;
      this.logger[name]({ msg: rest, stack });
    }
  }

  /**
   * Output log log
   *
   * @param message
   */
  log(message: string): void;
  log(message: Record<string, unknown>): void;
  log(message: string | Record<string, unknown>): void {
    this.callFunction('log', message);
  }

  /**
   * Output error log
   *
   * @param message
   */
  error(message: string): void;
  error(message: Record<string, unknown>): void;
  error(message: Error): void;
  error(message: string | Record<string, unknown> | Error): void {
    if (message instanceof Error) {
      const error = message;
      this.callFunction('error', { msg: error.message, stack: error.stack });
    } else {
      this.callFunction('error', message);
    }
  }

  /**
   * Output warn log
   *
   * @param message
   */
  warn(message: string): void;
  warn(message: Record<string, unknown>): void;
  warn(message: string | Record<string, unknown>): void {
    this.callFunction('warn', message);
  }

  /**
   * Output debug log
   *
   * @param message
   */
  debug(message: string): void;
  debug(message: Record<string, unknown>): void;
  debug(message: string | Record<string, unknown>): void {
    this.callFunction('debug', message);
  }

  /**
   * Output verbose log
   *
   * @param message
   */
  verbose(message: string): void;
  verbose(message: Record<string, unknown>): void;
  verbose(message: string | Record<string, unknown>): void {
    this.callFunction('verbose', message);
  }

  /**
   * Return pino instance
   */
  getLogger(): Logger {
    return this.logger;
  }

  /**
   * Return a child logger with cotext in bindings
   *
   * @param context
   */
  setContext(context: string): Logger {
    return this.logger.child({ context });
  }
}
