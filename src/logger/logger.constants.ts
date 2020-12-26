import { clc } from '@nestjs/common/utils/cli-colors.util';
import { transports, LoggerOptions, format } from 'winston';
import { nestJs } from '@/logger/logger.util';

/**
 * Provider token for global logger
 */
export const APP_LOGGER = 'APP_LOGGER';

/**
 * Option for Date.prototype.toLocaleString
 */
export const LOCALE_STRING_OPTIONS = {
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  day: '2-digit',
  month: '2-digit',
};

/**
 * NestJS log level
 */
export const NEST_LOG_LEVEL = {
  // log: 0,
  info: 0,
  error: 1,
  warn: 2,
  debug: 3,
  verbose: 4,
};

/**
 * NestJS log color schema
 */
export const NEST_COLOR_SCHEMA = {
  // log: clc.green,
  info: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

/**
 * Winston option for development
 */
export const devOption: LoggerOptions = {
  levels: NEST_LOG_LEVEL,
  level: 'verbose',
  transports: [
    new transports.Console({
      format: format.combine(nestJs({ colorSchema: NEST_COLOR_SCHEMA })),
    }),
  ],
};

/**
 * Winston option for production
 */
export const prodOption: LoggerOptions = {
  levels: NEST_LOG_LEVEL,
  level: 'error',
  format: format.json(),
  transports: [new transports.Console()],
};
