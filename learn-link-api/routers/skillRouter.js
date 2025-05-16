const { Router } = require("express");
const skillController = require("../controllers/skillController");
const authenticator = require("../middleware/authenticator");

const skillRouter = Router();

skillRouter.get("/user/:userId/skills", skillController.getUserSkills);
skillRouter.post("/user/:userId/add", authenticator, skillController.addUserSkill); // New endpoint with authentication - to add skills
skillRouter.post("/", skillController.createSkill);
skillRouter.get("/", skillController.searchSkills);

skillRouter.get("/current/:userId", skillController.currentSkillsInfo);
skillRouter.get("/trending", skillController.topSkillsInfo);

module.exports = {
  skillRouter
};
