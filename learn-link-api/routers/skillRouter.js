const { Router } = require("express");

const skillController = require("../controllers/skillController");

const skillRouter = Router();

router.post("/", skillController.createSkill);
router.get("/:id", skillController.getSkillById);
router.get("/", skillController.searchSkills);

module.exports = {
    skillRouter
}