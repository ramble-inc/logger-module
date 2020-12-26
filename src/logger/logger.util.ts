import { clc } from '@nestjs/common/utils/cli-colors.util';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { format } from 'winston';
import { Format } from 'logform';
import {
  NEST_COLOR_SCHEMA,
  LOCALE_STRING_OPTIONS,
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
 * NestJS like prettifier
 *
 * @param param0
 */
export const nestJs = ({
  colorSchema = NEST_COLOR_SCHEMA,
  appName = 'Nest',
}: NestJsFormatterOption): Format =>
  format.printf(({ level, message, context, stack }: NestJsFormatInfo) => {
    const color = colorSchema[level] as (msg: string) => string;

    let output = '';
    if (isObject(message)) {
      output = `${color('Object:')}\n${JSON.stringify(message, null, 2)}`;
    } else {
      output = color(message);
    }

    const pidMessage = color(`[${appName}] ${process.pid}   - `);
    const timestamp = new Date().toLocaleString(
      undefined,
      LOCALE_STRING_OPTIONS,
    );
    const contextMessage = clc.yellow(`[${context || 'LoggerService'}] `);
    const stackTrace =
      level === 'error' && stack != null ? `\n${getStackTrace(stack)}` : '';

    return `${pidMessage}${timestamp}   ${contextMessage}${color(
      `${output}`,
    )}${stackTrace}`;
  });
