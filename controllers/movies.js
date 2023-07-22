const movie = require('../models/movie');

const BadRequestError = require('../utils/errors/BadRequest');
const NotFoundError = require('../utils/errors/NotFound');
const ForbiddenError = require('../utils/errors/Forbidden');

const {
  ACCESS_DENIED_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  INVALID_DATA_MESSAGE,
} = require('../utils/errors/errorsMessages');

async function getCurrentUserFilms(req, res, next) {
  const userId = req.user._id;

  try {
    const movies = await movie.find({ owner: userId });
    return res.json(movies);
  } catch (error) {
    return next(error);
  }
}
async function addFilm(req, res, next) {
  try {
    const userId = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const newMovie = await movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: userId,
      movieId,
      nameRU,
      nameEN,
    });

    return res.status(201).json(newMovie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(INVALID_DATA_MESSAGE));
    }
    return next(error);
  }
}

async function deleteMovie(req, res, next) {
  const userId = req.user._id;
  const deletedMovieId = req.params.id;

  try {
    const deletedMovie = await movie.findOne({ movieId: deletedMovieId });

    if (!deletedMovie) {
      throw new NotFoundError(MOVIE_NOT_FOUND_MESSAGE);
    }

    if (deletedMovie.owner.toString() !== userId) {
      throw new ForbiddenError(ACCESS_DENIED_MESSAGE);
    }

    await movie.deleteOne({ movieId: deletedMovieId });

    return res.json(deletedMovie);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCurrentUserFilms,
  addFilm,
  deleteMovie,
};
