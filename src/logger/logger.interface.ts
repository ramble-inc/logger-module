import { TransformableInfo } from 'logform';

/**
 * Type for color function
 */
export type Colorizer = (text: string) => string;

/**
 * Type for color schema
 */
export interface ColorSchema {
  [key: string]: Colorizer;
}

/**
 * Type for winston metadata
 */
export interface WinstonMetadata {
  context: string;
  [key: string]: string;
}

/**
 * Type for NestJS formatter option
 */
export interface NestJsFormatterOption {
  colorSchema: ColorSchema;
  appName?: string;
}

/**
 * Type for NestFormatInfo
 */
export interface NestJsFormatInfo extends TransformableInfo {
  context: string;
  stack?: string;
  isObject: boolean;
}

/**
 * Type for NestFormatInfo
 */
export interface LoggingInterceptorOption {
  logOutgoingMessage: boolean;
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
