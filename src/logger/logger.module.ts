import { DynamicModule, Module } from '@nestjs/common';
import { createLogger, LoggerOptions } from 'winston';
import { WINSTON_LOGGER } from '@/logger/logger.constants';
import { LoggerService } from '@/logger/logger.service';

@Module({})
export class LoggerModule {
  public static forRoot(option: LoggerOptions): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      providers: [
        {
          provide: WINSTON_LOGGER,
          useValue: createLogger(option),
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
