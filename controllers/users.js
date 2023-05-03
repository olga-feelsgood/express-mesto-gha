const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorisedError = require('../errors/UnauthorisedError');
const ConflictingRequest = require('../errors/ConflictingRequestError');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) { next(new BadRequestError('Email или пароль не могут быть пустыми')); }
  // хешируем пароль
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((data) => {
      res.status(201).send({
        _id: data._id,
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictingRequest('Пользователь с указанным email уже зарегистрирован'));
      } else if (error.name === 'ValidationError') {
        next(BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else { next(error); }
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь с указанным id не найден');
      error.name = 'DocumentNotFoundError';
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Неверный формат id пользователя'));
      } else { next(error); }
    });
};

const updateUser = (req, res, next) => {
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
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else { next(error); }
    });
};

const updateUserAvatar = (req, res, next) => {
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
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else { next(error); }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) { next(new BadRequestError('Email или пароль не могут быть пустыми')); }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorisedError('Почта или пароль введены неправильно'));
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findOne({ _id: userId })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Неверный формат id пользователя'));
      } else { next(error); }
    });
};

module.exports = {
  updateUser, updateUserAvatar, createUser, getAllUsers, getUser, login, getCurrentUser,
};
