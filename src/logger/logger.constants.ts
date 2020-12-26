import { clc } from '@nestjs/common/utils/cli-colors.util';
import type { LoggerOptions } from 'pino';
import type { LogLevelLabel, LogLevelNumber } from '@/logger/logger.interface';
import { nestPrettifier } from '@/logger/logger.util';

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
  verbose: 10,
  debug: 20,
  warn: 30,
  error: 40,
  log: 50,
} as const;

/**
 * NestJS log level(key <=> value)
 */
export const LOG_LEVEL_SWAPPED = ((
  obj: Record<LogLevelLabel, LogLevelNumber>,
): Record<LogLevelNumber, LogLevelLabel> => {
  const ret = {};
  Object.entries(obj).forEach(([key, value]) => {
    ret[value] = key;
  });
  return ret as Record<LogLevelNumber, LogLevelLabel>;
})(NEST_LOG_LEVEL);

/**
 * NestJS log color schema
 */
export const NEST_COLOR_SCHEMA = {
  verbose: clc.cyanBright,
  debug: clc.magentaBright,
  warn: clc.yellow,
  error: clc.red,
  log: clc.green,
};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

/**
 * Common pino option
 */
export const commonOption: LoggerOptions = {
  // Define custom log level
  customLevels: NEST_LOG_LEVEL,

  // Exclude default pino log levels
  useOnlyCustomLevels: true,
};

/**
 * Pino option for development
 */
export const devOption: LoggerOptions = {
  ...commonOption,

  // set log level
  level: 'verbose',

  // change timestamp format
  timestamp: () =>
    `,"time":"${new Date(Date.now()).toLocaleString(
      undefined,
      LOCALE_STRING_OPTIONS,
    )}"`,

  // option passed to custom prettifier
  prettyPrint: {
    colorSchema: NEST_COLOR_SCHEMA,
  } as any,

  // set custom prettifier
  prettifier: nestPrettifier,
};

/**
 * Pino option for production
 */
export const prodOption: LoggerOptions = {
  ...commonOption,

  // set log level
  level: 'error',

  // change timestamp format
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,

  // log log level as string intead of number
  formatters: {
    level(label: string): { level: string } {
      return { level: label };
    },
  },
};
