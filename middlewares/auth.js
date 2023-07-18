const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/Unauthorized');
const { JWT } = require('../utils/env');

async function auth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Отсутствует токен авторизации'));
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }
}

module.exports = { auth };
