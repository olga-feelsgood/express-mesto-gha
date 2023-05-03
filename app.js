const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const ServerError = require('./errors/ServerError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(ftp|http|https):\/\/[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(router);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Запрашиваемые вами данные не найдены.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  next(new ServerError('На сервере произошла ошибка'));
});

app.listen(3000, () => {
  console.log('start hi');
});
