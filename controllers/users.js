const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const { JWT } = require("../utils/env");

const BadRequestError = require("../utils/errors/BadRequest");
const ConflictError = require("../utils/errors/Conflict");
const NotFoundError = require("../utils/errors/NotFound");
const UnauthorizedError = require("../utils/errors/Unauthorized");

const {
  USER_NOT_FOUND_MESSAGE,
  USER_CONFLICT_MESSAGE,
  INVALID_DATA_MESSAGE,
  INVALID_AUTH_DATA_MESSAGE,
  SUCCESS_LOGOUT_MESSAGE,
  SUCCESS_LOGIN_MESSAGE,
} = require("../utils/errors/errorsMessages");

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;

    const foundUser = await user.findById(userId).select("email name");
    if (!foundUser) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
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
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    if (email) {
      foundUser.email = email;
    }
    if (name) {
      foundUser.name = name;
    }

    await foundUser.save();
    return res.json(foundUser);
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, password, name } = req.body;

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
      return next(new ConflictError(USER_CONFLICT_MESSAGE));
    }
    if (error.name === "ValidationError") {
      return next(new BadRequestError(INVALID_DATA_MESSAGE));
    }
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const foundUser = await user.findOne({ email }).select("+password");

    if (!foundUser) {
      throw new UnauthorizedError(INVALID_AUTH_DATA_MESSAGE);
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedError(INVALID_AUTH_DATA_MESSAGE);
    }

    const token = jwt.sign({ _id: foundUser._id }, JWT, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 3600000 * 24 * 7,
      sameSite: true,
    });

    return res.send({ jwt: token, message: SUCCESS_LOGIN_MESSAGE });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new BadRequestError(INVALID_DATA_MESSAGE));
    }
    return next(error);
  }
}

async function logout(req, res) {
  res.clearCookie("jwt").send({ message: SUCCESS_LOGOUT_MESSAGE });
}

module.exports = {
  getCurrentUser,
  updateUserInfo,
  createUser,
  login,
  logout,
};
