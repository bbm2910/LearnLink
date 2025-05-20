const { Router } = require("express");
const skillController = require("../controllers/skillController");
const authenticator = require("../middleware/authenticator");

const skillRouter = Router();

skillRouter.get("/user/:userId/skills", skillController.getUserSkills);
skillRouter.post(
  "/user/:userId/add",
  authenticator,
  skillController.addUserSkill
); // New endpoint with authentication -to add skills
skillRouter.post("/", skillController.createSkill);
skillRouter.get("/:id", skillController.getSkillById);
skillRouter.get("/", skillController.searchSkills);

module.exports = {
  skillRouter,
};
