# @ramble-inc/nest-logger
<a href="https://www.npmjs.com/@ramble-inc/nest-logger" target="_blank"><img src="https://img.shields.io/npm/v/@ramble-inc/nest-logger.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/@ramble-inc/nest-logger" target="_blank"><img src="https://img.shields.io/npm/l/@ramble-inc/nest-logger.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/@ramble-inc/nest-logger" target="_blank"><img src="https://img.shields.io/npm/dm/@ramble-inc/nest-logger.svg" alt="NPM Downloads" /></a>
<a href="https://github.com/ramble-inc/nest-logger/actions" target="_blank"><img src="https://github.com/ramble-inc/nest-logger/workflows/CI/badge.svg" alt="GitHub Actions Status" /></a>

## Getting Started

### Installation
Usnig `yarn`
```
yarn add @ramble-inc/nest-logger
```
or using `npm`
```
npm i @ramble-inc/nest-logger
```

### Basic Usage
See [nest-winston README](https://github.com/gremo/nest-winston).

### Use Interceptor
Instantiate `LoggingInterceptor`
```typescript
import { LoggingInterceptor } from '@ramble-inc/nest-logger';

const interceptor = new LoggingInterceptor({
  // winston createLogger option
  // see: https://github.com/winstonjs/winston
};
```

Bind `LoggingInterceptor` to NestJS controller or method. In a controller
```typescript
import { LoggingInterceptor } from '@ramble-inc/nest-logger';

@Controller('cat')
@UseInterceptors(new LoggingInterceptor())
export class CatController {}
```

or use it as a global interceptor. In `main.ts`
``` typescript
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```
