import {
  NextFunction, Response, Request,
} from 'express';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types';
import Unauthorized from '../errors/unauthorized';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    next(new Unauthorized('Необходима авторизация'));
  }
  (req as IRequest).user = payload as {_id: string};

  next();
};
