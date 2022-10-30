import type {
  Request,
  Response,
  NextFunction,
  Errback,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';

const promiseStandardMw = (fn: RequestHandler, req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (typeof next === 'function') {
      next(err);
    }
  });
};

const promiseErrorMw = (
  fn: ErrorRequestHandler,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(err, req, res, next)).catch((error) => {
    if (typeof next === 'function') {
      next(error);
    }
  });
};

const standardMw = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
  promiseStandardMw(fn, req, res, next);

const withErrorMw =
  (fn: ErrorRequestHandler) => (err: Errback, req: Request, res: Response, next: NextFunction) =>
    promiseErrorMw(fn, err, req, res, next);

const mwWrapper = (mw: RequestHandler | ErrorRequestHandler) => {
  if (typeof mw !== 'function') throw new Error('Middleware should be a function');

  if (mw.length <= 3) return standardMw(mw as RequestHandler);

  return withErrorMw(mw as ErrorRequestHandler);
};

export const asyncMw = (...mws: RequestHandler[]) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper);
};

export const errorAsyncMw = (...mws: ErrorRequestHandler[]) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper);
};

export default asyncMw;
