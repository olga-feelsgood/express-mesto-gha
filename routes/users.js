const usersRouter = require('express').Router();
const {
  updateUser, updateUserAvatar, createUser, getAllUsers, getUser,
} = require('../controllers/users');

usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateUserAvatar);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);

module.exports = usersRouter;
