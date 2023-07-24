const usersRouter = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');
const {
  userSchemaValidator,
} = require('../middlewares/celebrateValidation');
const { auth } = require('../middlewares/auth');

usersRouter.get('/users/me', auth, getCurrentUser);
usersRouter.patch('/users/me', auth, userSchemaValidator, updateUserInfo);

module.exports = usersRouter;
