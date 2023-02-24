import type {
  Errback,
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line no-shadow
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string | number | symbol]: any;
    }

    // eslint-disable-next-line no-shadow
    interface Response {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string | number | symbol]: any;
    }
  }
}

export {};

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

const mwWrapper = <
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  ReqQuery = any,
  Parameter1 = RequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>,
  Parameter2 = ErrorRequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>
>(
  mw: Parameter1 | Parameter2
) => {
  if (typeof mw !== 'function') throw new Error('Middleware should be a function');

  if (mw.length <= 3) return standardMw(mw as RequestHandler);

  return withErrorMw(mw as ErrorRequestHandler);
};

export const asyncMw = <
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  ReqQuery = any,
  Parameter = RequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>
>(
  ...mws: Parameter[]
) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper) as Parameter[];
};

export const errorAsyncMw = <
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  ReqQuery = Query,
  Parameter = ErrorRequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>
>(
  ...mws: Parameter[]
) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper) as Parameter[];
};

export default asyncMw;
