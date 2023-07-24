const router = require('express').Router();

const {
  getCurrentUserFilms,
  addFilm,
  deleteMovie,
} = require('../controllers/movies');
const {
  movieSchemaValidator,
} = require('../middlewares/celebrateValidation');
const { auth } = require('../middlewares/auth');

router.get('', auth, getCurrentUserFilms);
router.post('', auth, movieSchemaValidator, addFilm);
router.delete('/:id', auth, deleteMovie);

module.exports = router;
