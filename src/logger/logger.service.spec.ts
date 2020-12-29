import { Logger } from 'winston';
import { createMockLogger } from '@/logger/logger.jest';
import { DEFAULT_CONTEXT, IS_OBJECT_SYMBOL } from '@/logger/logger.constants';
import { LoggerService } from '@/logger/logger.service';

describe('LoggerService', () => {
  let mockLogger;
  let service;

  beforeEach(() => {
    mockLogger = createMockLogger();
    service = new LoggerService(mockLogger as Logger);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('logger should have intended metadata', () => {
    expect(service.getMetadata()).toEqual({
      context: DEFAULT_CONTEXT,
    });

    const context = 'some context';
    service.setContext(context);

    expect(service.getMetadata()).toEqual({
      context,
    });

    const metadata = {
      context: 'new context',
      somethingElse: 'something else',
    };
    service.setMetadata(metadata);

    expect(service.getMetadata()).toEqual(metadata);
  });

  it.each([['info'], ['warn'], ['debug'], ['verbose']])(
    'logger should log %s log',
    (level) => {
      const message = 'message';
      const obj = { a: '123', b: 123 };
      const context = 'context';
      service[level](message);
      service[level](obj);
      service[level](message, context);
      service[level](obj, context);

      expect(mockLogger.log.mock.calls).toEqual([
        [
          level,
          message,
          { context: DEFAULT_CONTEXT, [IS_OBJECT_SYMBOL]: false },
        ],
        [level, { ...obj, context: DEFAULT_CONTEXT, [IS_OBJECT_SYMBOL]: true }],
        [level, message, { context, [IS_OBJECT_SYMBOL]: false }],
        [level, { ...obj, context, [IS_OBJECT_SYMBOL]: true }],
      ]);
    },
  );

  it('logger should log error log', () => {
    const message = 'message';
    const obj = { a: '123', b: 123 };
    const trace = 'trace';
    const context = 'context';
    service.error(message);
    service.error(obj);
    service.error(message, trace);
    service.error(obj, trace);
    service.error(message, trace, context);
    service.error(obj, trace, context);

    expect(mockLogger.log.mock.calls).toEqual([
      [
        'error',
        message,
        { context: DEFAULT_CONTEXT, [IS_OBJECT_SYMBOL]: false },
      ],
      ['error', { ...obj, context: DEFAULT_CONTEXT, [IS_OBJECT_SYMBOL]: true }],
      [
        'error',
        message,
        { context: DEFAULT_CONTEXT, stack: trace, [IS_OBJECT_SYMBOL]: false },
      ],
      [
        'error',
        {
          ...obj,
          context: DEFAULT_CONTEXT,
          stack: trace,
          [IS_OBJECT_SYMBOL]: true,
        },
      ],
      ['error', message, { context, stack: trace, [IS_OBJECT_SYMBOL]: false }],
      ['error', { ...obj, context, stack: trace, [IS_OBJECT_SYMBOL]: true }],
    ]);
  });

  it('child logger should have intended metadata', () => {
    jest.spyOn(mockLogger, 'child').mockReturnThis();

    const defaultChildContext = 'child';
    const childLogger = service.child({ context: defaultChildContext });

    expect(childLogger.getMetadata()).toEqual({
      context: defaultChildContext,
    });

    const context = 'some context';
    childLogger.setContext(context);

    expect(childLogger.getMetadata()).toEqual({
      context,
    });

    const metadata = {
      context: 'new context',
      somethingElse: 'something else',
    };
    childLogger.setMetadata(metadata);

    expect(childLogger.getMetadata()).toEqual(metadata);
  });

  it.each([['info'], ['warn'], ['debug'], ['verbose']])(
    'child logger should log %s log',
    (level) => {
      jest.spyOn(mockLogger, 'child').mockReturnThis();

      const message = 'message';
      const obj = { a: '123', b: 123 };
      const defaultChildContext = 'child';
      const context = 'context';
      const childLogger = service.child({ context: defaultChildContext });

      childLogger[level](message);
      childLogger[level](obj);
      childLogger[level](message, context);
      childLogger[level](obj, context);

      expect(mockLogger.log.mock.calls).toEqual([
        [
          level,
          message,
          { context: defaultChildContext, [IS_OBJECT_SYMBOL]: false },
        ],
        [
          level,
          { ...obj, context: defaultChildContext, [IS_OBJECT_SYMBOL]: true },
        ],
        [level, message, { context, [IS_OBJECT_SYMBOL]: false }],
        [level, { ...obj, context, [IS_OBJECT_SYMBOL]: true }],
      ]);
    },
  );

  it('child logger should log error log', () => {
    jest.spyOn(mockLogger, 'child').mockReturnThis();

    const message = 'message';
    const obj = { a: '123', b: 123 };
    const trace = 'trace';
    const defaultChildContext = 'child';
    const context = 'context';
    const childLogger = service.child({ context: defaultChildContext });

    childLogger.error(message);
    childLogger.error(obj);
    childLogger.error(message, trace);
    childLogger.error(obj, trace);
    childLogger.error(message, trace, context);
    childLogger.error(obj, trace, context);

    expect(mockLogger.log.mock.calls).toEqual([
      [
        'error',
        message,
        { context: defaultChildContext, [IS_OBJECT_SYMBOL]: false },
      ],
      [
        'error',
        { ...obj, context: defaultChildContext, [IS_OBJECT_SYMBOL]: true },
      ],
      [
        'error',
        message,
        {
          context: defaultChildContext,
          stack: trace,
          [IS_OBJECT_SYMBOL]: false,
        },
      ],
      [
        'error',
        {
          ...obj,
          context: defaultChildContext,
          stack: trace,
          [IS_OBJECT_SYMBOL]: true,
        },
      ],
      ['error', message, { context, stack: trace, [IS_OBJECT_SYMBOL]: false }],
      ['error', { ...obj, context, stack: trace, [IS_OBJECT_SYMBOL]: true }],
    ]);
  });
});
