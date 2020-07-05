import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { transports, format } from 'winston';
import { jest } from '@jest/globals';
import 'winston-daily-rotate-file';
import { LogOptionByEnv } from './logger.interface';

/**
 * Base option for log rotation
 */
const logRotateOption = {
  dirname: 'logs',
  extension: '.log',
  datePattern: 'YYYYMMDD',
};

/**
 * Winston format for development
 */
const devFormat = format.combine(
  format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike(),
);

/**
 * Winston format for production
 */
const prodFormat = format.combine(format.timestamp(), format.json());

/**
 * Winston option for application log
 */
export const applicationLogOption: LogOptionByEnv = {
  dev: {
    transports: [
      new transports.Console({
        format: devFormat,
        level: 'silly',
      }),
    ],
  },
  prod: {
    transports: [
      new transports.DailyRotateFile({
        ...logRotateOption,
        filename: 'app-%DATE%',
        format: prodFormat,
        level: 'info',
      }),
    ],
  },
};

/**
 * Winston option for access log
 */
export const accessLogOption: LogOptionByEnv = {
  dev: {
    transports: [
      new transports.Console({
        format: devFormat,
        level: 'silly',
      }),
    ],
  },
  prod: {
    transports: [
      new transports.DailyRotateFile({
        ...logRotateOption,
        filename: 'access-%DATE%',
        format: prodFormat,
        level: 'info',
      }),
    ],
  },
};

export const winstonMock = {
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    json: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
  }),
  transports: {
    Console: jest.fn(),
  },
};
