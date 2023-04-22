const User = require('../models/user');
const { serverError, badRequestError, notFoundError } = require('../errors/errorsConstants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(serverError).send({ message: 'Ошибка на сервере' });
      }
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь с указанным id не найден');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((user) => {
      if (user) { res.status(200).send(user); } else {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(badRequestError).send({ message: 'Неверный формат id пользователя' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным id не найден');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным id не найден');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(notFoundError).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  updateUser, updateUserAvatar, createUser, getAllUsers, getUser,
};
