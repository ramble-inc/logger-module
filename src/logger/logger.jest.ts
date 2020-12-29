import type { CallHandler, ExecutionContext } from '@nestjs/common';
import type { RpcArgumentsHost } from '@nestjs/common/interfaces';
import type { Logger } from 'winston';

/**
 * Mock for winston logger
 */
export const createMockLogger = (): Logger =>
  (({
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),

    child: jest.fn(),
  } as unknown) as Logger);

/**
 * Mock for RpcArgumentsHost
 */
export const createMockRpcArgumentsHost = (): RpcArgumentsHost => ({
  getData: jest.fn(),
  getContext: jest.fn(),
});

/**
 * Mock for ExecutionContext
 */
export const createMockExecutionContext = (): ExecutionContext => ({
  switchToRpc: jest.fn(),
  switchToHttp: jest.fn(),
  switchToWs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  getType: jest.fn(),
});

/**
 * Mock for CallHandler
 */
export const createMockCallHandler = (): CallHandler => ({
  handle: jest.fn(),
});
