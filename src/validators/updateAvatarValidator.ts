import { celebrate, Joi } from 'celebrate';

export default celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }).unknown(true),
});
