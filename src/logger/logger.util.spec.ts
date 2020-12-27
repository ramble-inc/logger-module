import type { TransformableInfo } from 'logform';
import { IS_OBJECT_SYMBOL, NEST_COLOR_SCHEMA } from '@/logger/logger.constants';
import { getStackTrace, nestJsFormat } from '@/logger/logger.util';

describe('logger.util.ts', () => {
  describe('getStackTrace', () => {
    it('should return pure stack trace without error name', () => {
      const message = 'some example error';
      const error = new Error(message);
      expect(getStackTrace(error.stack)).toEqual(
        expect.not.stringContaining(message),
      );
    });
  });

  describe('nestJsFormat', () => {
    const colors = {
      green: '\x1B[32m',
      yellow: '\x1B[33m',
      red: '\x1B[31m',
      magentaBright: '\x1B[95m',
      cyanBright: '\x1B[96m',
    };
    const reset = '\x1B[39m';
    const pid = 12345;
    const appName = 'Mock';
    const formatter = nestJsFormat({
      appName,
      colorSchema: NEST_COLOR_SCHEMA,
    });

    beforeAll(() => {
      Object.defineProperty(process, 'pid', {
        value: pid,
      });
      Date.now = jest.fn(() => 1609426800000);
    });

    it.each([
      ['info', 'green'],
      ['error', 'red'],
      ['warn', 'yellow'],
      ['debug', 'magentaBright'],
      ['verbose', 'cyanBright'],
    ])('should output %s string in %s', (level, color) => {
      const colorizer = colors[color] as string;
      const info = {
        level,
        message: 'message',
        context: 'LoggerService',
        [IS_OBJECT_SYMBOL]: false,
      };
      const log = formatter.transform(info)[Symbol.for('message')];

      expect(log).toBe(
        `${colorizer}[${appName}] ${pid}   - ${reset}01/01/2021, 12:00:00 AM   ${colors.yellow}[${info.context}] ${reset}${colorizer}${info.message}${reset}`,
      );
    });

    it.each([
      ['info', 'green'],
      ['error', 'red'],
      ['warn', 'yellow'],
      ['debug', 'magentaBright'],
      ['verbose', 'cyanBright'],
    ])('should output %s object in %s with context', (level, color) => {
      const colorizer = colors[color] as string;
      const obj = { a: 'aaa', b: 'bbb' };
      const info = {
        level,
        context: 'LoggerService',
        [IS_OBJECT_SYMBOL]: true,
        ...obj,
      };
      const log = formatter.transform((info as unknown) as TransformableInfo)[
        Symbol.for('message')
      ];

      expect(log).toBe(
        `${colorizer}[${appName}] ${pid}   - ${reset}01/01/2021, 12:00:00 AM   ${
          colors.yellow
        }[${
          info.context
        }] ${reset}${colorizer}Object:${reset}\n${JSON.stringify(
          obj,
          undefined,
          2,
        )}`,
      );
    });

    it('should output error error in red', () => {
      const colorizer = colors.red;
      const message = 'some example error';
      const error = new Error(message);
      const info = {
        level: 'error',
        message: error.toString(),
        context: 'LoggerService',
        stack: getStackTrace(error.stack),
      };
      const log = formatter.transform((info as unknown) as TransformableInfo)[
        Symbol.for('message')
      ];

      expect(log).toBe(
        `${colorizer}[${appName}] ${pid}   - ${reset}01/01/2021, 12:00:00 AM   ${colors.yellow}[${info.context}] ${reset}${colorizer}${info.message}${reset}\n${info.stack}`,
      );
    });
  });
});
