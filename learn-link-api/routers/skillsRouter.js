const { Router } = require('express');

// const { authenticator } = require('../middleware/authenticator');
const skillsController = require('../controllers/skillsController');

const skillsRouter = Router();

skillsRouter.get("/current", /* authenticator, */skillsController.currentSkillsInfo);
skillsRouter.get("/trending", /* authenticator, */skillsController.topSkillsInfo);


module.exports = {
    skillsRouter
};

