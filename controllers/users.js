const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const { JWT } = require('../utils/env');

const BadRequestError = require('../utils/errors/BadRequest');
const ConflictError = require('../utils/errors/Conflict');
const NotFoundError = require('../utils/errors/NotFound');
const UnauthorizedError = require('../utils/errors/Unauthorized');

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;

    const foundUser = await user.findById(userId).select('email name');
    if (!foundUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.json(foundUser);
  } catch (error) {
    return next(error);
  }
}

async function updateUserInfo(req, res, next) {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;

    const foundUser = await user.findById(userId);

    if (!foundUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    if (email) {
      user.email = email;
    }
    if (name) {
      user.name = name;
    }

    await user.save();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      email, password, name,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      email,
      password: hashedPassword,
      name,
    });

    const responseData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    return res.status(201).json(responseData);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('Пользователь с такими данными уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const foundUser = await user.findOne({ email }).select('+password');

    if (!foundUser) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const token = jwt.sign({ _id: foundUser._id }, JWT, { expiresIn: '7d' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });

    return res.status(200).json({ message: 'Вы успешно авторизованы' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при авторизации'));
    }
    return next(error);
  }
}

async function logout(req, res, next) {
  res.clearCookie('jwt').send({ message: 'Вы успешно вышли из системы' });
}

module.exports = {
  getCurrentUser,
  updateUserInfo,
  createUser,
  login,
  logout,
};
