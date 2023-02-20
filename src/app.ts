/* eslint-disable no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import BadRequestError from './errors/bad-request-err';
import NotFoundError from './errors/not-found-err';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import Unauthorized from './errors/unauthorized';
import auth from './middlewares/auth';
import requestLogger from './middlewares/requestLogger';
import errorLogger from './middlewares/errorLogger';
import ConflictingError from './errors/conflicting-err';
import authValidator from './validators/authValidator';
import loginValidator from './validators/loginValidator';
import createUserValidator from './validators/createUserValidator';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/alenadb');

app.use(requestLogger);

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(authValidator, auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(
  (
    err: BadRequestError | NotFoundError | Unauthorized | ConflictingError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });

    next();
  },
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
