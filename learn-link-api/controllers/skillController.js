const db = require("../database/connect");

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

  addUserSkill: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { skill_id, skill_type } = req.body;

      if (isNaN(userId) || !skill_id || !skill_type) {
        return res.status(400).json({
          error:
            "Invalid request. User ID, skill ID, and skill type are required.",
        });
      }

      if (skill_type !== "teaching" && skill_type !== "learning") {
        return res.status(400).json({
          error: "Skill type must be either 'teaching' or 'learning'.",
        });
      }

      // Check if user exists
      const userCheck = await db.query(
        "SELECT user_id FROM dim_user WHERE user_id = $1",
        [userId]
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if skill exists
      const skillCheck = await db.query(
        "SELECT skill_id FROM dim_skill WHERE skill_id = $1",
        [skill_id]
      );

      if (skillCheck.rows.length === 0) {
        return res.status(404).json({ error: "Skill not found" });
      }

      // Determine which table to update
      const tableName =
        skill_type === "teaching" ? "facts_teaching" : "facts_learning";

      // Check if user already has an entry in the respective table
      const userEntryCheck = await db.query(
        `SELECT * FROM ${tableName} WHERE user_id = $1`,
        [userId]
      );

      let result;

      if (userEntryCheck.rows.length === 0) {
        // If no entry exists, create a new one with skill_1_id
        result = await db.query(
          `INSERT INTO ${tableName} (user_id, skill_1_id) VALUES ($1, $2) RETURNING *`,
          [userId, skill_id]
        );
      } else {
        // If entry exists, find the first empty skill slot and update it - this doesn't work yet !!!
        const userEntry = userEntryCheck.rows[0];
        let updatedField = null;

        if (!userEntry.skill_1_id) {
          updatedField = "skill_1_id";
        } else if (!userEntry.skill_2_id) {
          updatedField = "skill_2_id";
        } else if (!userEntry.skill_3_id) {
          updatedField = "skill_3_id";
        } else if (!userEntry.skill_4_id) {
          updatedField = "skill_4_id";
        } else if (!userEntry.skill_5_id) {
          updatedField = "skill_5_id";
        }

        if (updatedField) {
          // Update the first empty slot
          result = await db.query(
            `UPDATE ${tableName} SET ${updatedField} = $1 WHERE user_id = $2 RETURNING *`,
            [skill_id, userId]
          );
        } else {
          // All slots are full
          return res.status(400).json({
            error: `Maximum number of ${skill_type} skills reached (5). Remove a skill before adding a new one.`,
          });
        }
      }

      res.status(201).json({
        message: `Skill successfully added to user's ${skill_type} skills`,
        data: result.rows[0],
      });
    } catch (err) {
      console.error(`Error adding skill to user:`, err);
      res.status(500).json({ error: "Failed to add skill to user" });
    }
  },
};

module.exports = skillController;
