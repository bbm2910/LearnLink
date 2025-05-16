const { Router } = require("express");

const skillController = require("../controllers/skillController");

const skillRouter = Router();

skillRouter.get("/user/:userId/skills", skillController.getUserSkills);

skillRouter.post("/", skillController.createSkill);
skillRouter.get("/:id", skillController.getSkillById);
skillRouter.get("/", skillController.searchSkills);

module.exports = {
  skillRouter,
};
