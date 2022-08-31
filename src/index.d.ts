declare namespace Express {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string | number | symbol]: any;
  }

  interface Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string | number | symbol]: any;
  }
}

declare module 'express-asyncmw' {
  import type { RequestHandler, ErrorRequestHandler } from 'express';

  function asyncMw(...mws: RequestHandler[]): (ErrorRequestHandler | RequestHandler)[];

  export = asyncMw;
}
