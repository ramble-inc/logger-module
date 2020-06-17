import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { transports, format } from 'winston';
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
      }),
    ],
  },
  prod: {
    transports: [
      new transports.DailyRotateFile({
        ...logRotateOption,
        filename: 'app-%DATE%',
        format: prodFormat,
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
      }),
    ],
  },
  prod: {
    transports: [
      new transports.DailyRotateFile({
        ...logRotateOption,
        filename: 'access-%DATE%',
        format: prodFormat,
      }),
    ],
  },
};
