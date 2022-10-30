import type {
  Errback,
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

export * from './express-mod';

export declare const asyncMw: (
  ...mws: RequestHandler[]
) => (
  | ((req: Request, res: Response, next: NextFunction) => void)
  | ((err: Errback, req: Request, res: Response, next: NextFunction) => void)
)[];

export declare const errorAsyncMw: (
  ...mws: ErrorRequestHandler[]
) => (
  | ((req: Request, res: Response, next: NextFunction) => void)
  | ((err: Errback, req: Request, res: Response, next: NextFunction) => void)
)[];
