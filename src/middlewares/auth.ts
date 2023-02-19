import {
  NextFunction, Response, RequestHandler, Request,
} from 'express';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types';
import Unauthorized from '../errors/unauthorized';

const auth = function (req: Request, res: Response, next: NextFunction):void {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    throw new Unauthorized('Необходима авторизация');
  }
  (req as IRequest).user = payload;

  next();
} as RequestHandler;

export default auth;
