import { celebrate, Joi } from 'celebrate';

export default () => celebrate({
  headers: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
  params: Joi.object().keys({ cardId: Joi.string().required() }).unknown(true),
});
