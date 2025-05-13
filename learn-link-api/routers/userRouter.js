const { Router } = require('express');

const userController = require('../controllers/users.js');

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/user/login", userController.userLogin);

module.exports = { 
    userRouter
}