import { clc } from '@nestjs/common/utils/cli-colors.util';

/**
 * Provider token for global logger
 */
export const APP_LOGGER = 'APP_LOGGER';

/**
 * Provider token for winston instance
 */
export const WINSTON_LOGGER = 'WINSTON_LOGGER';

/**
 * Default context
 */
export const DEFAULT_CONTEXT = 'LoggerService';

/**
 * Symbol for isObject in NestJsFormatInfo
 */
export const IS_OBJECT_SYMBOL = Symbol('isObject');

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
