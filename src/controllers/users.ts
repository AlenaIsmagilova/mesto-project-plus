import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { NotFoundError } from "../errors/not-found-err";
import { BadRequestError } from "../errors/bad-request-err";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body || {};

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      } else {
        next(err);
      }
    });
};

export const updateOwnProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return User.findByIdAndUpdate((req as any).user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении профиля"
          )
        );
      } else {
        next(err);
      }
    });
};

export const updateOwnAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    (req as any).user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении аватара"
          )
        );
      } else {
        next(err);
      }
    });
};
