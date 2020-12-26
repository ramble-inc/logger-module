import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, LeveledLogMethod, Logger, LoggerOptions } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private option: LoggerOptions;

  private logger: Logger;

  constructor(option: LoggerOptions, logger?: Logger) {
    this.option = option;
    this.logger = logger || createLogger(option);
  }

  /**
   * Generic log method
   *
   * @param name
   * @param message
   */
  private callFunction(
    name: string,
    message: string | Record<string, unknown>,
  ): void {
    if (this.logger[name] == null) {
      throw new Error(`logger.${name} is not implemented`);
    }
    if (typeof message === 'string') {
      (this.logger[name] as LeveledLogMethod)({ message });
    } else if (typeof message === 'object') {
      (this.logger[name] as LeveledLogMethod)(message);
    }
  }

  /**
   * Output log log
   * Alias to info log
   *
   * @param message
   */
  public log(message: string): void;
  public log(message: Record<string, unknown>): void;
  public log(message: string | Record<string, unknown>): void {
    this.callFunction('info', message);
  }

  /**
   * Output info log
   *
   * @param message
   */
  public info(message: string): void;
  public info(message: Record<string, unknown>): void;
  public info(message: string | Record<string, unknown>): void {
    this.callFunction('info', message);
  }

  /**
   * Output warn log
   *
   * @param message
   */
  public error(message: string): void;
  public error(message: Error): void;
  public error(message: Record<string, unknown>): void;
  public error(message: string | Error | Record<string, unknown>): void {
    if (message instanceof Error) {
      this.callFunction('error', {
        message: message.toString(),
        stack: message.stack,
      });
    } else {
      this.callFunction('error', message);
    }
  }

  /**
   * Output warn log
   *
   * @param message
   */
  public warn(message: string): void;
  public warn(message: Record<string, unknown>): void;
  public warn(message: string | Record<string, unknown>): void {
    this.callFunction('warn', message);
  }

  /**
   * Output debug log
   *
   * @param message
   */
  public debug(message: string): void;
  public debug(message: Record<string, unknown>): void;
  public debug(message: string | Record<string, unknown>): void {
    this.callFunction('debug', message);
  }

  /**
   * Output verbose log
   *
   * @param message
   */
  public verbose(message: string): void;
  public verbose(message: Record<string, unknown>): void;
  public verbose(message: string | Record<string, unknown>): void {
    this.callFunction('verbose', message);
  }

  /**
   * Create child logger
   *
   * @param meta
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public child(meta: Object): LoggerService {
    return new LoggerService(this.option, this.logger.child(meta));
  }

  /**
   * Return winston instance
   */
  public getLogger(): Logger {
    return this.logger;
  }
}
