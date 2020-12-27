/**
 * Increase the default timeout interval for tests and before/after hooks in milliseconds.
 * Default: 5000
 */
jest.setTimeout(10000);

/**
 * Mock winston to silence logger output
 */
// jest.mock('winston', () => ({
//   format: {
//     colorize: jest.fn(),
//     combine: jest.fn(),
//     json: jest.fn(),
//     label: jest.fn(),
//     timestamp: jest.fn(),
//     printf: jest.fn(),
//   },
//   createLogger: jest.fn().mockReturnValue({
//     error: jest.fn(),
//     warn: jest.fn(),
//     info: jest.fn(),
//     http: jest.fn(),
//     verbose: jest.fn(),
//     debug: jest.fn(),
//     silly: jest.fn(),
//   }),
//   transports: {
//     Console: jest.fn(),
//   },
// }));
