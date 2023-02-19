import { celebrate, Joi } from 'celebrate';

export default () => celebrate({
  headers: Joi.object({
    authorization: Joi.string().required().regex(/^Bearer\s/),
  }).unknown(true),
});
