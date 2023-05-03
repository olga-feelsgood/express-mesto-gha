const usersRouter = require('express').Router();
const {
  updateUser, updateUserAvatar, getAllUsers, getUser, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateUserAvatar);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);

module.exports = usersRouter;
