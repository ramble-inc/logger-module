import type { Logger } from 'winston';
import { LoggingInterceptor } from '@/logger/logger.interceptor';
import { LoggerService } from '@/logger/logger.service';
import {
  mockCallHandler,
  mockExecutionContext,
  mockLogger,
  mockRpcArgumentsHost,
} from '@/logger/logger.jest';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeAll(() => {
    const loggerService = new LoggerService((mockLogger as unknown) as Logger);
    interceptor = new LoggingInterceptor(loggerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('intercept', () => {
    it('should call getClass, getHandler, and getArgByIndex', () => {
      const spyGetData = jest
        .spyOn(mockRpcArgumentsHost, 'getData')
        .mockReturnValueOnce({ data: 'data' });
      const spyGetContext = jest
        .spyOn(mockRpcArgumentsHost, 'getContext')
        .mockReturnValueOnce({
          _internal_repr: {
            'user-agent': 'ios',
          },
        });
      const spyGetClass = jest
        .spyOn(mockExecutionContext, 'getClass')
        .mockReturnValueOnce({ name: 'SomeClass' });
      const spyGetHandler = jest
        .spyOn(mockExecutionContext, 'getHandler')
        .mockReturnValueOnce({ name: 'SomeMethod' });
      const spySwitchToRpc = jest
        .spyOn(mockExecutionContext, 'switchToRpc')
        .mockReturnValueOnce(mockRpcArgumentsHost);

      const value = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      expect(value).toBeUndefined();
      expect(mockCallHandler.handle.mock.calls).toEqual([[]]);
      expect(spyGetData.mock.calls).toEqual([[]]);
      expect(spyGetContext.mock.calls).toEqual([[]]);
      expect(spyGetClass.mock.calls).toEqual([[]]);
      expect(spyGetHandler.mock.calls).toEqual([[]]);
      expect(spySwitchToRpc.mock.calls).toEqual([[]]);
    });
  });
});
