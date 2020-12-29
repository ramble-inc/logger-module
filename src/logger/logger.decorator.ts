/* eslint-disable prefer-rest-params */
import { Inject, LoggerService as NestLoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Decorator to log every incoming gRPC streaming message
 * see https://stackoverflow.com/questions/60578332/use-global-nest-module-in-decorator/60608856#60608856
 */
export const LogIncomingMessage = <
  T extends NestLoggerService = NestLoggerService
>(Logger: {
  new (...args: unknown[]): T;
}): MethodDecorator => {
  const injectLogger = Inject(Logger);
  return (
    target: { new (): unknown },
    name: string,
    descriptor: PropertyDescriptor,
  ): void => {
    injectLogger(target, 'logger');
    const context = `${target.constructor.name}.${name}`;
    // eslint-disable-next-line @typescript-eslint/ban-types
    const method = descriptor.value as Function;

    /**
     * This part gets executed when controller method gets executed.
     * Use non-arrow function to make "this" refer to the controller
     */
    function handler() {
      arguments[0] = (arguments[0] as Observable<unknown>).pipe(
        tap((data) => {
          (this as { logger: NestLoggerService }).logger.log(data, context);
        }),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return method.apply(this, arguments);
    }

    /**
     * Change handler.constructor.name to match with original handler name defined in controller.
     * Without this, ExecutionContext.getHandler does not work as intended
     */
    Object.defineProperty(handler, 'name', { value: name });

    // eslint-disable-next-line no-param-reassign
    descriptor.value = handler;
  };
};
