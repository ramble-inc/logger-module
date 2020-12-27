import { transports, LoggerOptions, format } from 'winston';
import { NEST_COLOR_SCHEMA, NEST_LOG_LEVEL } from '@/logger/logger.constants';
import { nestJsFormat } from '@/logger/logger.util';

/**
 * Winston option for development
 */
export const devOption: LoggerOptions = {
  levels: NEST_LOG_LEVEL,
  level: 'verbose',
  transports: [
    new transports.Console({
      format: nestJsFormat({ colorSchema: NEST_COLOR_SCHEMA }),
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
