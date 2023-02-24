import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export * from './express-mod';

export declare const asyncMw: <
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  ReqQuery = any,
  Parameter = RequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>
>(
  ...mws: Parameter[]
) => Parameter[];

export declare const errorAsyncMw: <
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  ReqQuery = Query,
  Parameter = ErrorRequestHandler<Params, ResBody, ReqBody, ReqQuery, LocalsObj>
>(
  ...mws: Parameter[]
) => Parameter[];
