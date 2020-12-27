import { clc } from '@nestjs/common/utils/cli-colors.util';
import { format as winstonFormat } from 'winston';
import { Format } from 'logform';
import stringify from 'fast-safe-stringify';
import {
  NEST_COLOR_SCHEMA,
  LOCALE_STRING_OPTIONS,
  IS_OBJECT_SYMBOL,
} from '@/logger/logger.constants';
import type {
  NestJsFormatterOption,
  NestJsFormatInfo,
} from '@/logger/logger.interface';

/**
 * Remove the frist line from stack trace to get pure stack trace
 *
 * @param stackTrace
 */
export const getStackTrace = (stackTrace: string): string => {
  const lines = stackTrace.split('\n');
  lines.splice(0, 1);
  return lines.join('\n');
};

/**
 * NestJS like format
 *
 * @param param0
 */
export const nestJsFormat = ({
  colorSchema = NEST_COLOR_SCHEMA,
  appName = 'Nest',
}: NestJsFormatterOption): Format =>
  winstonFormat.printf((formatInfo: NestJsFormatInfo) => {
    const { level, message, context, stack, isObject, ...rest } = formatInfo;
    const color = colorSchema[level];

    // see https://github.com/microsoft/TypeScript/pull/26797
    const output = formatInfo[(IS_OBJECT_SYMBOL as unknown) as string]
      ? `${color('Object:')}\n${stringify(rest, null, 2)}`
      : color(message);
    const pidMessage = color(`[${appName}] ${process.pid}   - `);
    const timestamp = new Date(Date.now()).toLocaleString(
      undefined,
      LOCALE_STRING_OPTIONS,
    );
    const contextMessage = context ? clc.yellow(`[${context}] `) : '';
    const stackTrace = level === 'error' && stack != null ? `\n${stack}` : '';

    return `${pidMessage}${timestamp}   ${contextMessage}${output}${stackTrace}`;
  });
