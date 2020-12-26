import type { ValuesType } from 'utility-types';
import { NEST_LOG_LEVEL } from '@/logger/logger.constants';

/**
 * Custom prettyPrint option
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type NestPrettyPrintOption = {
  colorSchema: {
    verbose: (text: string) => string;
    debug: (text: string) => string;
    warn: (text: string) => string;
    error: (text: string) => string;
    log: (text: string) => string;
  };
};

/**
 * Type for pino.LoggerOptions.prettyPrint
 */
export interface NestPrettifierOption {
  prettyPrint: NestPrettyPrintOption;
}

/**
 * Union type for log level text
 */
export type LogLevelLabel = keyof typeof NEST_LOG_LEVEL;

/**
 * Uion type for log level number
 */
export type LogLevelNumber = ValuesType<typeof NEST_LOG_LEVEL>;

/**
 * Type for nestPrettifier args
 */
export interface InputData {
  level: LogLevelNumber;
  pid: string;
  time: string;
  hostname: string;
  context: string;
  msg: string | Record<string, unknown>;
  stack?: string;
}

/**
 * Type for meta info in message.
 * Comes as the 2nd item of ExecutionContext.getArgs().
 */
export interface MetaData {
  _internal_repr: {
    'user-agent': string[];
  };
}
