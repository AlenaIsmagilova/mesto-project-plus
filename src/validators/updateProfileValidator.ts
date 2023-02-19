import { celebrate, Joi } from 'celebrate';
import { regExpForLinks } from '../constants/index';

export default () => celebrate({
  headers: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().regex(regExpForLinks).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().email(),
    password: Joi.string(),
  }).unknown(true),
});
