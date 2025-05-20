const { Router } = require("express");

const userController = require("../controllers/userController");
const authenticator = require("../middleware/authenticator");

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.userLogin);

userRouter.get("/profile", authenticator, userController.getProfile);
userRouter.get("/top-users", userController.getTopUsers);
userRouter.get('/by-email', authenticator, userController.getUserByEmail)
userRouter.get("/:userId", userController.getUserById);

module.exports = {
  userRouter,
};
