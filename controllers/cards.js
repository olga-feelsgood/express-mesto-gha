const Card = require('../models/card');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else { res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const putLikeToCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else { res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteLikeFromCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else { res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  createCard, getAllCards, deleteCard, putLikeToCard, deleteLikeFromCard,
};
