import { BadRequestError } from "../errors/bad-request-err";
import { NotFoundError } from "../errors/not-found-err";
import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { IRequest } from "../types";

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

  return Card.findByIdAndRemove({ cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным _id не найдена");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id карточки"));
      } else {
        next(err);
      }
    });
};

export const createCard = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body || {};

  Card.create({ name, link, owner: req.user._id })
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

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки");
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
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
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
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
