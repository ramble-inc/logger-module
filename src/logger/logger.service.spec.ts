import { LoggerService } from '@/logger/logger.service';
import { devOption, prodOption } from '@/logger/logger.constants';

describe('LoggerService', () => {
  describe('NestJS format', () => {
    let service: LoggerService;

    beforeAll(() => {
      service = new LoggerService(devOption);
    });

    it('log', () => {
      service.error('dev');
      service.error({ x: 123 });
      service.error(new Error('eeeee'));
      const child = service.setContext('asdf');
      child.error('dev');
      service.error('dev');
      // service.error('dev');
      // service.warn('dev');
      // service.debug('dev');
      // service.verbose('dev');
      expect(service).toBeDefined();
    });
  });

  describe('JSON format', () => {
    let service: LoggerService;

    beforeAll(() => {
      service = new LoggerService(prodOption);
    });

    it('log', () => {
      service.error('prod');
      service.error({ x: 123 });
      service.error(new Error('eeeee'));
      // service.error('prod');
      // service.warn('prod');
      // service.debug('prod');
      // service.verbose('prod');
      expect(service).toBeDefined();
    });
  });
});
