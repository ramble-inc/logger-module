import { LoggerOptions } from 'winston';

/**
 * Type for meta info in message.
 * Comes as the 2nd item of ExecutionContext.getArgs().
 */
export interface MetaData {
  _internal_repr: {
    'user-agent': string[];
  };
}

/**
 * Winston format for production
 */
export interface LogOptionByEnv {
  dev: LoggerOptions;
  prod: LoggerOptions;
}
