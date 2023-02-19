import { celebrate, Joi } from 'celebrate';

export default celebrate({
  headers: Joi.object({
    authorization: Joi.string().regex(/^Bearer\s/),
  }).unknown(true),
});
