import { LogIncomingMessage } from '@/logger/logger.decorator';
import { LoggerService } from '@/logger/logger.service';
import { Observable } from 'rxjs';

describe('LogIncomingMessage', () => {
  const mockLog = jest.fn();

  class Test {
    private logger: LoggerService = ({
      log: mockLog,
    } as unknown) as LoggerService;

    @LogIncomingMessage(LoggerService)
    public test(observable$: Observable<unknown>) {
      return observable$;
    }
  }

  it('should call logger.log', () => {
    const data = { mock: 'mock' };
    const observable$ = new Observable((subscriber) => {
      subscriber.next(data);
    });
    const test = new Test();
    test.test(observable$).subscribe((v) => v);

    expect(mockLog.mock.calls).toEqual([
      [data, `${test.constructor.name}.${test.test.name}`],
    ]);
  });
});
