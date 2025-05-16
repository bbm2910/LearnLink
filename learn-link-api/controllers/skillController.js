const axios = require("axios");

const { Skill } = require("../models/Skill");
const { formatCurrentSkillsData, formatTopSkillsData } = require("../helpers/dataProcessor");

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

  currentUserSkillsInfo: async (req, res) => {
    try {
        // Retrieve data for visualisation from database
        const skillsData = await Skill.getCurrentSkillsInfo(req.params.userId);

        // Format into separate arrays
        const formattedData = formatCurrentSkillsData(skillsData);

        // Send request to Python data API
        const response = await axios.post("http://localhost:3005/current-skills-chart", formattedData);

        // Return JSON response
        res.status(200).json({
            success: true,
            visualisation: response.data
      });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  topSkillsInfo: async (req, res) => {
    try {
        // Retrieve data for visualisation from database
        const skillsData = await Skill.getTopSkillsInfo();

        // Format into separate arrays
        const formattedData = formatTopSkillsData(skillsData);

        // Send request to Python data API
        const response = await axios.post("http://localhost:3005/top-skills-chart", formattedData);

        // Return JSON response
        res.status(200).json({
          success: true,
          visualisation: response.data
      });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  }
};

module.exports = skillController
