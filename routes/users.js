const usersRouter = require("express").Router();

const { getCurrentUser, updateUserInfo } = require("../controllers/users");
const {
  userUpdateSchemaValidator,
} = require("../middlewares/celebrateValidation");
const { auth } = require("../middlewares/auth");

usersRouter.get("/me", auth, getCurrentUser);
usersRouter.patch("/me", auth, userUpdateSchemaValidator, updateUserInfo);

module.exports = usersRouter;
