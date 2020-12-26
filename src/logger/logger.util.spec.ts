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
});
