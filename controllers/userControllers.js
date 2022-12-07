// переменные окружения
const { NODE_ENV, JWT_SECRET } = process.env;

// подключение модулей
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// модель юзера
const User = require('../models/user');

// ошибки
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// текст ошибок
const {
  validationErrorText,
  conflictErrorEmailText,
  unauthorizedErrorText,
} = require('../utils/const');


// создание юзера (регистрация)
function createUser(req, res, next) {
  const {                               // вытаскиваем имейл и пароль из тела запроса
    email,
    password,
    admin,
  } = req.body;

  bcrypt.hash(password, 10)            // хэширование пароля
    .then((hash) => {
      User.create({                    // если хэш пароля ок - создание юзера с данными из тела запроса с хэш-паролем 
        email,
        password: hash,
        admin,
      })
        .then((user) => {
          res.send({                  // все ок - получаем в ответе имейл и id
            email,
            _id: user._id,
            admin,
          });
        })
        .catch((err) => {                                                   //все не ок - получаем ошибку 
          if (err.name === 'ValidationError') {
            const errObject = Object.keys(err.errors).join(', ');
            next(new BadRequestError(validationErrorText(errObject)));
            return;
          }
          if (err.code === 11000) {
            next(new ConflictError(conflictErrorEmailText));
            return;
          }
          next(err);                   // выходим из ошибки создания юзера
        });
    }).catch(next);                    // если хэш-пароль не ок - выходим из него ошибкой 
}

// авторизация
function login(req, res, next) {

  const {
    email,
    password
  } = req.body;                                                             // вытаскиваем имейл и пароль из тела запроса 

  User.findUserByCredentials(email, password)                               // findUserByCredentials - функция, созданная в схеме юзера, ищет соответстие пользователя по емейлу и паролю
    .then((user) => {

      const token = jwt.sign(                                               // создаем токен
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token })                                                   //отправляем токен в ответе
        .end();
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new UnauthorizedError(unauthorizedErrorText));
        return;
      }
      next(err);
    });
}

module.exports = {
  createUser,
  login
};