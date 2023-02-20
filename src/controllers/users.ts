import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import Unauthorized from '../errors/unauthorized';
import ConflictingError from '../errors/conflicting-err';

export default (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUserById = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      } else {
        next(err);
      }
    });
} as RequestHandler;

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body || {};

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.code === 11000) {
        next(new ConflictingError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Unauthorized('Неправильные почта или пароль');
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('httpOnly', token);
      res.send({ token });
    });
  })
    .catch(next);
};

export const updateOwnProfile = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
} as RequestHandler;

export const updateOwnAvatar = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      } else {
        next(err);
      }
    });
} as RequestHandler;
