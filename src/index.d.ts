declare namespace Express {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string | number | symbol]: any;
  }

  interface Respone {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string | number | symbol]: any;
  }
}

declare module 'express-asyncmw' {
  // eslint-disable-next-line import/no-unresolved
  import { RequestHandler } from 'express';

  function asyncMw(...mws: RequestHandler[]): void;

  export = asyncMw;
}
