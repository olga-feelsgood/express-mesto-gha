const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else { next(error); }
    });
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      const cardOwner = card.owner.toString().replace('new ObjectId("', '');
      if (req.user._id === cardOwner) {
        Card.findByIdAndRemove(cardId)
          .populate(['owner', 'likes'])
          .orFail(() => {
            const error = new Error('Карточка с указанным id не найдена');
            error.name = 'DocumentNotFoundError';
            throw error;
          })
          .then((cardToDelete) => {
            res.status(200).send(cardToDelete);
          })
          .catch((error) => {
            if (error.name === 'DocumentNotFoundError') {
              next(new NotFoundError('Карточка с указанным id не найдена'));
            } else if (error.name === 'CastError') {
              next(new BadRequestError('Неверный формат id карточки'));
            } else { next(error); }
          });
      } else {
        next(new ForbiddenError('Нет прав на удаление выбранной карточки'));
      }
    });
};

const putLikeToCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      const error = new Error('Карточка с указанным id не найдена');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Неверный формат id карточки'));
      } else { next(error); }
    });
};

const deleteLikeFromCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      const error = new Error('Карточка с указанным id не найдена');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Неверный формат id карточки'));
      } else { next(error); }
    });
};

module.exports = {
  createCard, getAllCards, deleteCard, putLikeToCard, deleteLikeFromCard,
};
