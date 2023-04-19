const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '643965691cb53ccab9107b5e' };
  next();
});
app.use(router);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Ошибка 404. Запрашиваемые вами данные не найдены.' });
  next();
});

app.listen(3000, () => {
  console.log('start hi');
});
