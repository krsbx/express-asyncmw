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
  namespace Express {
    // eslint-disable-next-line no-shadow
    interface Request {
      [key: string | number | symbol]: any;
    }

    // eslint-disable-next-line no-shadow
    interface Response {
      [key: string | number | symbol]: any;
    }
  }
}

type AsyncParam = {
  params?: ParamsDictionary;
  resBody?: unknown;
  reqBody?: unknown;
  locals?: Record<string, any>;
  reqQuery?: unknown;
  extends?: unknown;
};

type ReqObj<T extends AsyncParam, DefaultQuery = Query & Record<any, any>> = Request<
  T['params'] extends NonNullable<T['params']> ? T['params'] : ParamsDictionary,
  T['resBody'] extends NonNullable<T['resBody']> ? T['resBody'] : any,
  T['reqBody'] extends NonNullable<T['reqBody']> ? T['reqBody'] : any,
  T['reqQuery'] extends NonNullable<T['reqQuery']> ? T['reqQuery'] & DefaultQuery : DefaultQuery,
  T['locals'] extends NonNullable<T['locals']>
    ? T['locals'] & Record<string, any>
    : Record<string, any>
>;

type ResObj<T extends AsyncParam> = Response<
  T['resBody'] extends NonNullable<T['resBody']> ? T['resBody'] : any,
  T['locals'] extends NonNullable<T['locals']>
    ? T['locals'] & Record<string, any>
    : Record<string, any>
>;

type ExtendReq<T extends AsyncParam, U> = T['extends'] extends NonNullable<T['extends']>
  ? T['extends'] & U
  : U;

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

const noErrorHandlingMw =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next);

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

export const asyncMw = <T extends AsyncParam = {}>(
  ...mws: ((req: ExtendReq<T, ReqObj<T>>, res: ResObj<T>, next: NextFunction) => void)[]
) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper) as RequestHandler[];
};

export const errorAsyncMw = <T extends AsyncParam = {}>(
  ...mws: ((err: any, req: ExtendReq<T, ReqObj<T>>, res: ResObj<T>, next: NextFunction) => void)[]
) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(mwWrapper) as ErrorRequestHandler[];
};

export const wrapperMw = <T extends AsyncParam = {}>(
  ...mws: ((req: ExtendReq<T, ReqObj<T>>, res: ResObj<T>, next: NextFunction) => void)[]
) => {
  // Change to array if the request is not an array
  if (!Array.isArray(mws)) mws = [mws]; // eslint-disable-line no-param-reassign

  return mws.map(noErrorHandlingMw);
};

export default asyncMw;
