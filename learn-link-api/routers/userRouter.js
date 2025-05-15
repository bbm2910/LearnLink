const { Router } = require("express");

const userController = require("../controllers/userController");
const authenticator = require("../middleware/authenticator");

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.userLogin);

userRouter.get("/profile", authenticator, userController.getProfile);

module.exports = {
  userRouter,
};
