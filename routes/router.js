const router = require('express').Router();
const usersRouter = require('./users');
const movies = require('./movies');

const { auth } = require('../middlewares/auth');

const NotFoundError = require('../utils/errors/NotFound');

const { createUser, login, logout } = require('../controllers/users'); // добавить в контроллер юзерс функцию логаута
const {
  userSchemaValidator,
} = require('../middlewares/celebrateValidation');

router.post('/signup', userSchemaValidator, createUser);
router.post('/signin', userSchemaValidator, login);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, movies);
router.get('/signout', auth, logout);

router.use((req, res, next) => next(new NotFoundError('Неправильный путь')));

module.exports = router;
