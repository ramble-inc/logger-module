/**
 * Mock for winston logger
 */
export const mockLogger = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),

  child: jest.fn(),
};

/**
 * Mock for RpcArgumentsHost
 */
export const mockRpcArgumentsHost = {
  getData: jest.fn(),
  getContext: jest.fn(),
};

/**
 * Mock for ExecutionContext
 */
export const mockExecutionContext = {
  switchToRpc: jest.fn(),
  switchToHttp: jest.fn(),
  switchToWs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  getType: jest.fn(),
};

/**
 * Mock for CallHandler
 */
export const mockCallHandler = {
  handle: jest.fn(),
};
