const Card = require('../models/card');
const { serverError, badRequestError, notFoundError } = require('../errors/errorsConstants');

const createCard = (req, res) => {
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
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .orFail(() => {
      const error = new Error('Карточка с указанным id не найдена');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((card) => {
      if (card) {
        res.send(card);
      } else { res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const putLikeToCard = (req, res) => {
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
      if (card) {
        res.status(200).send(card);
      } else { res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const deleteLikeFromCard = (req, res) => {
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
      if (card) {
        res.status(200).send(card);
      } else { res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  createCard, getAllCards, deleteCard, putLikeToCard, deleteLikeFromCard,
};
