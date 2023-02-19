import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import Unauthorized from '../errors/unauthorized';
import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import Card from '../models/card';
import { IRequest } from '../types';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const deleteCardById = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
):void {
  Card.findByIdAndRemove(req.params.cardId).then((card) => {
    if (card?.owner.toString() !== req.user._id) {
      throw new Unauthorized('Недостаточно прав для удаления карточки');
    }
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    res.send({ data: card });
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
} as RequestHandler;

export const createCard = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void {
  const { name, link } = req.body || {};

  Card.create({ name, link, owner: req.user })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
} as RequestHandler;

export const likeCard = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
): void {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      } else {
        next(err);
      }
    });
} as RequestHandler;

export const dislikeCard = function (
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные для снятии лайка'),
        );
      } else {
        next(err);
      }
    });
} as RequestHandler;
