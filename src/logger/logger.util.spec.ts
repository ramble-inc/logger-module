import { devOption } from '@/logger/logger.constants';
import pino, { Logger } from 'pino';

describe('LoggerService', () => {
  let logger: Logger;

  beforeAll(() => {
    logger = pino(devOption);
  });

  it('should be defined', () => {
    logger.log({
      msg: 'message',
      timestampDiff: '368',
    });

    const childLogger = logger.child({ context: 'cccc' });
    childLogger.error('error error');
    childLogger.debug({ key: 'asdf' });

    expect(logger).toBeDefined();
  });
});
