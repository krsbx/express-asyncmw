import type { Request, Response, NextFunction, Errback, RequestHandler } from 'express';

const promiseMw = (fn: Function, ...rest: (Errback | Request | Response | NextFunction)[]) => {
  const nextFn = rest[rest.length - 1];

  Promise.resolve(fn(...rest)).catch((err) => {
    if (typeof nextFn === 'function') {
      nextFn(err);
    }
  });
};

const standardMw = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  promiseMw(fn, req, res, next);

const withErrorMw =
  (fn: Function) => (err: Errback, req: Request, res: Response, next: NextFunction) =>
    promiseMw(fn, err, req, res, next);

const mwWrapper = (mw: Function | unknown) => {
  if (typeof mw !== 'function') throw new Error('Middleware should be a function');

  if (mw.length <= 3) return standardMw(mw);

  return withErrorMw(mw);
};

const asyncMw = (...mws: RequestHandler[]) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper);
};

export = asyncMw;
