import { clc } from '@nestjs/common/utils/cli-colors.util';
import { isObject } from '@nestjs/common/utils/shared.utils';
import {
  LOG_LEVEL_SWAPPED,
  NEST_COLOR_SCHEMA,
} from '@/logger/logger.constants';
import type {
  InputData,
  NestPrettyPrintOption,
} from '@/logger/logger.interface';

/**
 * NestJS like prettifier
 *
 * @param param0
 */
export const nestPrettifier = ({
  colorSchema = NEST_COLOR_SCHEMA,
}: NestPrettyPrintOption): ((inputData: InputData) => string) => {
  return ({
    level,
    time,
    pid,
    hostname, // eslint-disable-line @typescript-eslint/no-unused-vars
    context,
    msg,
    stack,
  }: InputData): string => {
    const logLevel = LOG_LEVEL_SWAPPED[level];
    const color = colorSchema[logLevel];

    let output = '';
    if (logLevel === 'error' && stack) {
      output = stack;
    } else if (isObject(msg)) {
      output = `${color('Object:')}\n${JSON.stringify(msg, null, 2)}`;
    } else {
      output = color(msg);
    }

    const pidMessage = color(`[Nest] ${pid}   - `);
    const contextMessage = context ? clc.yellow(`[${context}] `) : '';

    return `${pidMessage}${time}   ${contextMessage}${color(`${output}`)}\n`;
  };
};
