import { BadRequestError } from "../errors/bad-request-err";
import { NotFoundError } from "../errors/not-found-err";
import { NextFunction, Request, Response } from "express";
import Card from "../models/card";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;

  return Card.findOneAndRemove({ cardId })
    .then((card) => {
      if (!cardId) {
        throw new NotFoundError("Карточка с указанным _id не найдена");
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body || {};

  Card.create({ name, link, owner: (req as any).user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: (req as any).user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!cardId) {
        throw new NotFoundError("Передан несуществующий _id карточки");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для постановки лайка"
          )
        );
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: (req as any).user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!cardId) {
        throw new NotFoundError("Передан несуществующий _id карточки");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Переданы некорректные данные для снятии лайка")
        );
      } else {
        next(err);
      }
    });
};
