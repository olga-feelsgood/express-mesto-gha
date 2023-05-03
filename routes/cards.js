const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getAllCards, deleteCard, putLikeToCard, deleteLikeFromCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(ftp|http|https):\/\/[^ "]+$/),
  }),
}), createCard);

cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), putLikeToCard);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLikeFromCard);

module.exports = cardsRouter;
