const { celebrate, Joi } = require("celebrate");
const { urlRegex } = require("../utils/regex");

const userSchemaValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const userUpdateSchemaValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const movieSchemaValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlRegex),
    trailerLink: Joi.string().regex(urlRegex),
    thumbnail: Joi.string().regex(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
  }),
});

module.exports = {
  userSchemaValidator,
  movieSchemaValidator,
  userUpdateSchemaValidator,
};
