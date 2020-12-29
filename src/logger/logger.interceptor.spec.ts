import { Observable } from 'rxjs';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import {
  createMockCallHandler,
  createMockExecutionContext,
  createMockRpcArgumentsHost,
} from '@/logger/logger.jest';

describe('LoggingInterceptor', () => {
  let mockLoggerService;
  let mockCallHandler;
  let mockExecutionContext;
  let mockRpcArgumentsHost;
  const data = { data: 'data' };
  const userAgent = 'ios';
  const className = 'SomeClass';
  const methodName = 'SomeMethod';
  const res = { mock: 'mock' };
  const observable$ = new Observable((subscriber) => {
    subscriber.next(res);
  });

  beforeAll(() => {
    mockLoggerService = {
      info: jest.fn(),
    };
    mockCallHandler = createMockCallHandler();
    mockExecutionContext = createMockExecutionContext();
    mockRpcArgumentsHost = createMockRpcArgumentsHost();

    mockRpcArgumentsHost.getContext.mockReturnValue({
      _internal_repr: {
        'user-agent': userAgent,
      },
    });
    mockRpcArgumentsHost.getData.mockReturnValue(data);
    mockExecutionContext.getClass.mockReturnValue({
      name: className,
    });
    mockExecutionContext.getHandler.mockReturnValue({
      name: methodName,
    });
    mockExecutionContext.switchToRpc.mockReturnValue(mockRpcArgumentsHost);
    mockCallHandler.handle.mockReturnValue(observable$);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should call getClass, getHandler, switchToRpc, getData, getContext, and handle', () => {
      const interceptor = new LoggingInterceptor(mockLoggerService);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((v) => v);

      expect(mockExecutionContext.getClass.mock.calls).toEqual([[]]);
      expect(mockExecutionContext.getHandler.mock.calls).toEqual([[]]);
      expect(mockExecutionContext.switchToRpc.mock.calls).toEqual([[]]);
      expect(mockRpcArgumentsHost.getData.mock.calls).toEqual([[]]);
      expect(mockRpcArgumentsHost.getContext.mock.calls).toEqual([[]]);
      expect(mockCallHandler.handle.mock.calls).toEqual([[]]);
    });

    describe('logOutgoingMessage is true', () => {
      it('should call logger.info twice', () => {
        const interceptor = new LoggingInterceptor(mockLoggerService, {
          logOutgoingMessage: true,
        });

        interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .subscribe((v) => v);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockLoggerService.info).toHaveBeenNthCalledWith(
          2,
          res,
          `${className}.${methodName}`,
        );
      });
    });

    describe('logOutgoingMessage is false', () => {
      it('should call logger.info once', () => {
        const interceptor = new LoggingInterceptor(mockLoggerService, {
          logOutgoingMessage: false,
        });

        interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .subscribe((v) => v);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockLoggerService.info).toHaveBeenCalledTimes(1);
      });
    });
  });
});
