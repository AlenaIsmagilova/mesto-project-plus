import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import authValidator from '../validators/authValidator';
import createCardValidator from '../validators/createCardValidator';
import cardValidator from '../validators/cardValidator';

const cardRouter = Router();
cardRouter.get('/', authValidator, getCards);
cardRouter.post('/', createCardValidator, createCard);
cardRouter.delete('/:cardId', cardValidator, deleteCardById);
cardRouter.put('/:cardId/likes', cardValidator, likeCard);
cardRouter.delete('/:cardId/likes', cardValidator, dislikeCard);

export default cardRouter;
