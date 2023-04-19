const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      if (newUser) { res.status(200).send(newUser); } else {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
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
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  updateUser, updateUserAvatar, createUser, getAllUsers, getUser,
};
