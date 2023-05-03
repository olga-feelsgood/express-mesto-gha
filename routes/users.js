const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, updateUserAvatar, getAllUsers, getUser, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }),
}), updateUserAvatar);

usersRouter.get('/', getAllUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

module.exports = usersRouter;
