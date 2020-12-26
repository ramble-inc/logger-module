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
