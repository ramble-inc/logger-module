/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as ProtoLoader from '@grpc/proto-loader';
import {
  loadPackageDefinition,
  credentials,
  ClientReadableStream,
  ClientWritableStream,
  ClientDuplexStream,
} from '@grpc/grpc-js';
import {
  ServiceClient,
  ServiceClientConstructor,
} from '@grpc/grpc-js/build/src/make-client';
import * as path from 'path';
import {
  devOption,
  LoggingInterceptor,
  LoggerModule,
  LoggerService,
} from '@/logger';
import { HeroModule } from './hero.module';
import { Hero, HeroById } from './hero';

describe('HeroController (E2E)', () => {
  let module: TestingModule;
  let app: INestMicroservice;
  let client: ServiceClient;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule.forRoot(devOption), HeroModule],
    }).compile();

    const url = 'localhost:5000';
    app = module.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url,
        package: ['hero'],
        protoPath: [path.resolve(__dirname, './hero.proto')],
      },
    });

    app.useGlobalInterceptors(
      new LoggingInterceptor(app.get(LoggerService), {
        logOutgoingMessage: true,
      }),
    );
    await app.listenAsync();

    const proto = await ProtoLoader.load(
      path.resolve(__dirname, './hero.proto'),
    );
    const protoGrpc = loadPackageDefinition(proto) as {
      hero: {
        HeroService: ServiceClientConstructor;
      };
    };
    client = new protoGrpc.hero.HeroService(url, credentials.createInsecure());
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it('unaryCall', async () => {
    await new Promise<void>((resolve) => {
      const payload: HeroById = { id: 1 };

      client.unaryCall(payload, (err: Error, response: Hero) => {
        expect(err).toBeNull();
        expect(response).toEqual({ id: 1, name: 'John' });
        resolve();
      });
    });
  });

  it('clientStreamAsObservable', async () => {
    const callHandler = client.clientStreamAsObservable(
      (err: Error, res: Hero) => {
        if (err && String(err).toLowerCase().indexOf('cancelled') === -1) {
          fail(`gRPC Stream error happened, error: ${err.toString()}`);
        }
        expect(res).toEqual({ id: 2, name: 'Doe' });
      },
    ) as ClientWritableStream<HeroById>;

    return new Promise<void>((resolve) => {
      callHandler.write({ id: 1 });
      callHandler.write({ id: 2 });
      callHandler.end();
      setTimeout(() => resolve(), 1000);
    });
  });

  it('serverStreamAsObservable', async () => {
    const callHandler = client.serverStreamAsObservable({
      id: 1,
    }) as ClientReadableStream<Hero>;

    let n = 0;
    callHandler.on('data', (msg: Hero) => {
      if (n === 0) expect(msg).toEqual({ id: 1, name: 'John' });
      else if (n === 1) expect(msg).toEqual({ id: 2, name: 'Doe' });
      else fail(`received unexpected message: ${JSON.stringify(msg)}`);
      n += 1;
    });

    callHandler.on('error', (err: Error) => {
      if (String(err).toLowerCase().indexOf('cancelled') === -1) {
        fail(`gRPC Stream error happened, error: ${err.toString()}`);
      }
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    });
  });

  it('bidirectionalStreamAsObservable', async () => {
    const callHandler = client.bidirectionalStreamAsObservable() as ClientDuplexStream<
      HeroById,
      Hero
    >;
    const payloads = [{ id: 1 }, { id: 2 }];
    const responses = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    let n = 0;
    callHandler.on('data', (msg: Hero) => {
      if (n === 0) expect(msg).toEqual({ id: 1, name: 'John' });
      else if (n === 1) expect(msg).toEqual({ id: 2, name: 'Doe' });
      else fail(`received unexpected message: ${JSON.stringify(msg)}`);
      n += 1;

      if (n === responses.length) callHandler.cancel();
    });

    callHandler.on('error', (err: Error) => {
      if (String(err).toLowerCase().indexOf('cancelled') === -1) {
        fail(`gRPC Stream error happened, error: ${err.toString()}`);
      }
    });

    await new Promise<void>((resolve) => {
      payloads.forEach((payload) => callHandler.write(payload));
      setTimeout(() => resolve(), 1000);
    });
  });
});
