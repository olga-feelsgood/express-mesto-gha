const cardsRouter = require('express').Router();
const {
  createCard, getAllCards, deleteCard, putLikeToCard, deleteLikeFromCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', putLikeToCard);
cardsRouter.delete('/:cardId/likes', deleteLikeFromCard);

module.exports = cardsRouter;
