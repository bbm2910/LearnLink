const { Skill } = require("../models/Skill");

const skillController = {
  createSkill: async (req, res) => {
    try {
      const newSkill = await Skill.create(req.body);
      res.status(201).json(newSkill);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getSkillById: async (req, res) => {
    try {
      const skill = await Skill.getOneById(req.params.id);
      res.json(skill);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  searchSkills: async (req, res) => {
    try {
      const results = await Skill.search(req.query.q || "");
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserSkills: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const skills = await Skill.getUserSkills(userId);
      res.json(skills);
    } catch (err) {
      console.error("Error fetching user skills:", err);
      res.status(500).json({ error: "Failed to fetch user skills" });
    }
  },
};

module.exports = skillController;
