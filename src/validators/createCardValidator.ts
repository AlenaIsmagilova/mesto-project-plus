import { celebrate, Joi } from 'celebrate';
import { regExpForLinks } from '../constants/index';

export default celebrate({
  headers: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regExpForLinks).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').required(),
    owner: Joi.string().required(),
  }).unknown(true),
});
