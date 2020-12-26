import { devOption } from '@/logger/logger.constants';
import { LoggerService } from '@/logger/logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;

  beforeAll(() => {
    logger = new LoggerService(devOption);
  });

  it('should log string', () => {
    const message = 'message';
    logger.log(message);
    logger.info(message);
    logger.error(message);
    logger.warn(message);
    logger.debug(message);
    logger.verbose(message);

    expect(logger).toBeDefined();
  });

  it('should log object', () => {
    const message = { a: '123', b: 123 };
    logger.log(message);
    logger.info(message);
    logger.error(message);
    logger.warn(message);
    logger.debug(message);
    logger.verbose(message);

    expect(logger).toBeDefined();
  });

  it('should log error', () => {
    const message = new Error('something went wrong');
    logger.error(message);

    expect(logger).toBeDefined();
  });

  it('child logger should log', () => {
    const childLogger = logger.child({ context: 'cccc' });
    const message = 'message';
    childLogger.log(message);
    childLogger.info(message);
    childLogger.error(message);
    childLogger.warn(message);
    childLogger.debug(message);
    childLogger.verbose(message);

    const obj = { a: '123', b: 123 };
    childLogger.log(obj);
    childLogger.info(obj);
    childLogger.error(obj);
    childLogger.warn(obj);
    childLogger.debug(obj);
    childLogger.verbose(obj);

    const error = new Error('something went wrong');
    logger.error(error);

    expect(childLogger).toBeDefined();
  });
});
